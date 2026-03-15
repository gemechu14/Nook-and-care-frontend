import { api } from "@/lib/axios";
import { tokenStorage } from "@/lib/tokenStorage";
import { BASE_URL } from "@/constants/config";
import type { ApiUser } from "@/types/user";

// ─── Request types ────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: "FAMILY" | "SENIOR" | "PROVIDER";
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiUser> => {
    const url = `${BASE_URL}/auth/login`;

    // Try OAuth2 form-urlencoded with username first
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: data.email, password: data.password }),
    });

    // Fallback: JSON format
    if (!res.ok && res.status === 422) {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
    }

    // Fallback: form-urlencoded with email field
    if (!res.ok && res.status === 422) {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: data.email, password: data.password }),
      });
    }

    if (!res.ok) {
      let errorMessage = "Invalid email or password";
      try {
        const errBody = await res.json();
        if (Array.isArray(errBody?.detail)) {
          errorMessage = `Validation error: ${(errBody.detail as Array<{ loc?: string[]; msg: string }>)
            .map((e) => `${e.loc?.join(".")}: ${e.msg}`)
            .join(", ")}`;
        } else if (errBody?.detail) {
          errorMessage =
            typeof errBody.detail === "string"
              ? errBody.detail
              : JSON.stringify(errBody.detail);
        }
      } catch {
        // use default message
      }
      throw new Error(errorMessage);
    }

    const tokens: TokenResponse = await res.json();
    tokenStorage.setAccess(tokens.access_token);
    tokenStorage.setRefresh(tokens.refresh_token);

    return api.get<ApiUser>("/auth/me");
  },

  register: async (data: RegisterRequest): Promise<ApiUser> =>
    api.postNoAuth<ApiUser>("/auth/register", data),

  me: (): Promise<ApiUser> => api.get<ApiUser>("/auth/me"),

  logout: (): void => tokenStorage.clear(),

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

