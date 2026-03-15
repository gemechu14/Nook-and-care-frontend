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
    try {
      console.log("🌐 BASE_URL:", BASE_URL);
      const url = `${BASE_URL}/auth/login`;
      console.log("🔐 Calling login API:", url);
      console.log("📧 Email:", data.email);
      
      // Try form-urlencoded with username first (OAuth2 standard format)
      let res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: data.email, password: data.password }),
      });
      
      let lastErrorBody: any = null;
      
      // If that fails with 422, try JSON format
      if (!res.ok && res.status === 422) {
        console.log("⚠️ Form-urlencoded with username failed (422), trying JSON format...");
        try {
          lastErrorBody = await res.json();
          console.log("422 Error details:", lastErrorBody);
        } catch {}
        
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
      }
      
      // If still 422, try form-urlencoded with email instead of username
      if (!res.ok && res.status === 422) {
        console.log("⚠️ JSON format failed (422), trying form-urlencoded with email...");
        try {
          lastErrorBody = await res.json();
          console.log("422 Error details:", lastErrorBody);
        } catch {}
        
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email: data.email, password: data.password }),
        });
      }
      
      console.log("📡 Login API response status:", res.status, res.statusText);
      
      if (!res.ok) {
        let errorMessage = "Invalid email or password";
        try {
          // Try to get error body from current response, or use lastErrorBody
          let errBody = lastErrorBody;
          if (!errBody) {
            errBody = await res.json();
          }
          console.log("❌ Error response body:", errBody);
          
          // Handle different error response formats
          if (Array.isArray(errBody?.detail)) {
            // FastAPI validation errors come as array
            const validationErrors = errBody.detail.map((err: any) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else if (errBody?.detail) {
            errorMessage = typeof errBody.detail === "string" 
              ? errBody.detail 
              : JSON.stringify(errBody.detail);
          } else {
            errorMessage = errBody?.message || errBody?.error || errorMessage;
          }
          
          if (typeof errorMessage !== "string") {
            errorMessage = JSON.stringify(errorMessage);
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          // If JSON parsing fails, use default message
        }
        throw new Error(errorMessage);
      }
      
      const tokens: TokenResponse = await res.json();
      tokenStorage.setAccess(tokens.access_token);
      tokenStorage.setRefresh(tokens.refresh_token);
      
      // Get user profile
      try {
        return await api.get<ApiUser>("/auth/me");
      } catch (meError) {
        // If /auth/me fails, still consider login successful (tokens are saved)
        throw new Error("Login successful but failed to load user profile. Please try again.");
      }
    } catch (error) {
      // Re-throw Error instances as-is, wrap others
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred during login");
    }
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

