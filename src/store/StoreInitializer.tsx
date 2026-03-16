"use client";

import { useEffect } from "react";
import { useAuthStore } from "./authStore";

/**
 * Initialises the Zustand auth store on first render.
 * Must be rendered inside the root layout (client component).
 * No Provider is required — Zustand stores are global.
 */
export default function StoreInitializer() {
  const refreshUser = useAuthStore((s) => s.refreshUser);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return null;
}





