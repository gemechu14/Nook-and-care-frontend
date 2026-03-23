"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { providersApi } from "@/features/providers/services";
import { isWhiteHeaderPath, isAuthPage } from "../_lib/constants";
import type { ApiUser } from "@/types";

export function useHeaderState(user: ApiUser | null) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [checkingProvider, setCheckingProvider] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === "/";
  const hideHeader = isAuthPage(pathname);
  const isWhiteHeader = isWhiteHeaderPath(pathname, isScrolled);
  const isFamily = user && (user.role === "FAMILY" || user.role === "SENIOR");

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (user && isFamily) {
      setCheckingProvider(true);
      providersApi
        .list({ limit: 100 })
        .then((providers) => {
          const userProvider = providers.find((p) => p.user_id === user.id);
          setHasProvider(!!userProvider);
        })
        .catch(() => setHasProvider(false))
        .finally(() => setCheckingProvider(false));
    } else {
      setHasProvider(false);
      setCheckingProvider(false);
    }
  }, [user, isFamily]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleUserMenu = useCallback(() => setUserMenuOpen((o) => !o), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);

  return {
    pathname,
    isScrolled,
    userMenuOpen,
    mobileMenuOpen,
    showProviderModal,
    setShowProviderModal,
    hasProvider,
    checkingProvider,
    userMenuRef,
    mobileMenuRef,
    hideHeader,
    isWhiteHeader,
    isFamily,
    toggleUserMenu,
    toggleMobileMenu,
    setUserMenuOpen,
    setMobileMenuOpen,
  };
}
