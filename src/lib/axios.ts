import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "./tokenStorage";
import { BASE_URL } from "@/constants/config";

// ─── Axios instance ──────────────────────────────────────────────────────────

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — attach Bearer token ────────────────────────────────

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess();
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  // For FormData, let axios set the correct Content-Type automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// ─── Response interceptor — normalise errors ─────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown; message?: string }>) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;

    let detail = `HTTP ${status}`;

    if (body) {
      if (Array.isArray(body.detail)) {
        const msgs = (body.detail as Array<{ loc?: string[]; msg: string }>)
          .map((e) => `${e.loc?.slice(1).join(".") ?? "field"}: ${e.msg}`)
          .join("; ");
        detail = `Validation error: ${msgs}`;
      } else if (typeof body.detail === "string") {
        detail = body.detail;
      } else if (body.detail) {
        detail = JSON.stringify(body.detail);
      } else if (body.message) {
        detail = body.message;
      }
    }

    // If token is invalid/expired, clear auth and force login.
    const isInvalidCredentials =
      status === 401 ||
      detail.toLowerCase().includes("could not validate credentials") ||
      detail.toLowerCase().includes("not authenticated");

    if (isInvalidCredentials) {
      tokenStorage.clear();
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign(`/login?next=${encodeURIComponent(currentPath)}`);
        }
      }
    }

    return Promise.reject(new Error(detail));
  }
);

// ─── Typed helper wrappers ────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) =>
    axiosInstance.get<T>(path).then((r) => r.data),

  post: <T>(path: string, body?: unknown) =>
    axiosInstance.post<T>(path, body).then((r) => r.data),

  put: <T>(path: string, body?: unknown) =>
    axiosInstance.put<T>(path, body).then((r) => r.data),

  patch: <T>(path: string, body?: unknown) =>
    axiosInstance.patch<T>(path, body).then((r) => r.data),

  delete: <T>(path: string, config?: { data?: unknown }) =>
    axiosInstance.delete<T>(path, config).then((r) => r.data),

  postForm: <T>(path: string, formData: FormData) =>
    axiosInstance.post<T>(path, formData).then((r) => r.data),

  /** Skip auth — used for register / public endpoints */
  postNoAuth: <T>(path: string, body?: unknown) => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
    return instance.post<T>(path, body).then((r) => r.data);
  },
};




