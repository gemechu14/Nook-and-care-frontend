"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "@/lib/api/auth";
import type { RegisterRequest } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/tokenStorage";
import type { ApiUser } from "@/types";

interface AuthContextValue {
  user: ApiUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.getAccess();
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      tokenStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    console.log("🔑 AuthContext.login called with email:", email);
    try {
      console.log("📞 Calling authApi.login...");
      const me = await authApi.login({ email, password });
      console.log("✅ Login successful, user:", me);
      setUser(me);
    } catch (error) {
      console.error("❌ AuthContext login error:", error);
      // Re-throw so the component can handle it
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      // Auto-login after register
      const me = await authApi.login({ email: data.email, password: data.password });
      setUser(me);
    } catch (error) {
      // Re-throw so the component can handle it
      throw error;
    }
  };

  const logout = async () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Safe version — returns null instead of throwing if no provider */
export function useOptionalAuth() {
  return useContext(AuthContext);
}

