import { api, BASE_URL } from "@/lib/apiClient";
import { tokenStorage } from "@/lib/tokenStorage";
import type { ApiUser } from "@/types";

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest {
  email: string; password: string; full_name: string;
  phone?: string; role?: "FAMILY" | "SENIOR" | "PROVIDER";
}
export interface TokenResponse { access_token: string; refresh_token: string; token_type: string; }

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiUser> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: data.email, password: data.password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail ?? "Invalid credentials");
    }
    const tokens: TokenResponse = await res.json();
    tokenStorage.setAccess(tokens.access_token);
    tokenStorage.setRefresh(tokens.refresh_token);
    return api.get<ApiUser>("/auth/me");
  },

  register: async (data: RegisterRequest): Promise<ApiUser> => {
    const user = await api.postNoAuth<ApiUser>("/auth/register", data);
    return user;
  },

  me: (): Promise<ApiUser> => api.get<ApiUser>("/auth/me"),

  logout: () => tokenStorage.clear(),

  refresh: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) return;
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (res.ok) {
        const tokens: TokenResponse = await res.json();
        tokenStorage.setAccess(tokens.access_token);
      }
    } catch {
      tokenStorage.clear();
    }
  },
};

