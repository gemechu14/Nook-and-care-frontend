import { create } from "zustand";
import { authApi } from "@/features/auth/services";
import { tokenStorage } from "@/lib/tokenStorage";
import type { ApiUser } from "@/types/user";
import type { RegisterRequest } from "@/features/auth/services";

// ─── State interface ──────────────────────────────────────────────────────────

interface AuthState {
  user: ApiUser | null;
  loading: boolean;

  /** Re-fetch the current user from the API using the stored token */
  refreshUser: () => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// ─── Zustand store ────────────────────────────────────────────────────────────

// Check for token synchronously on initialization
const hasToken = typeof window !== "undefined" && !!tokenStorage.getAccess();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Only set loading to true if we have a token (need to verify it)
  // If no token, we know immediately user is not logged in
  loading: hasToken,

  refreshUser: async () => {
    const token = tokenStorage.getAccess();
    if (!token) {
      set({ user: null, loading: false });
      return;
    }
    try {
      const me = await authApi.me();
      set({ user: me, loading: false });
    } catch {
      tokenStorage.clear();
      set({ user: null, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    const me = await authApi.login({ email, password });
    set({ user: me });
  },

  register: async (data: RegisterRequest) => {
    await authApi.register(data);
    // Auto-login after register
    const me = await authApi.login({
      email: data.email,
      password: data.password,
    });
    set({ user: me });
  },

  logout: () => {
    authApi.logout();
    set({ user: null });
  },
}));

// ─── Convenience aliases (replaces the old useAuth / useOptionalAuth hooks) ───

/** Throws if the store is not found (it never will, kept for API compatibility) */
export function useAuth() {
  return useAuthStore();
}

/** Returns the store — always available with Zustand, no Provider needed */
export function useOptionalAuth() {
  return useAuthStore();
}






