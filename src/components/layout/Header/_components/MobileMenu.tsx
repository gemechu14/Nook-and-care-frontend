"use client";

import Link from "next/link";
import { getNavItems, getDashboardHref } from "../_lib/constants";
import { getHeaderTheme } from "../_lib/theme";
import type { ApiUser } from "@/types";
import type { NavItem } from "../_lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  user: ApiUser | null;
  isWhiteHeader: boolean;
  hasProvider: boolean;
  isFamily: boolean;
  showLoading: boolean;
  onClose: () => void;
  onLogout: () => void;
  onProviderClick: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export function MobileMenu({
  isOpen,
  navItems,
  user,
  isWhiteHeader,
  hasProvider,
  isFamily,
  showLoading,
  onClose,
  onLogout,
  onProviderClick,
  menuRef,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const theme = getHeaderTheme(isWhiteHeader);

  return (
    <div
      ref={menuRef}
      className={`absolute left-0 right-0 top-16 z-40 md:hidden ${theme.mobileMenuBg} shadow-lg`}
    >
      <div className="space-y-1 px-6 py-4">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`block rounded-lg px-4 py-3 font-medium transition-colors ${theme.mobileLink}`}
          >
            {label}
          </Link>
        ))}

        <div className={`my-2 border-t ${theme.mobileDivider}`} />

        {showLoading ? (
          <div className="flex items-center justify-center px-4 py-3">
            <div
              className={`h-5 w-5 animate-spin rounded-full border-2 ${
                isWhiteHeader ? "border-slate-300" : "border-slate-400"
              } border-t-transparent`}
            />
          </div>
        ) : (
          <>
            {user ? (
              <>
                <div
                  className={`mb-2 rounded-lg px-4 py-3 ${theme.mobileUserBg}`}
                >
                  <p className={`text-sm font-semibold ${theme.mobileUserText}`}>
                    {user.full_name}
                  </p>
                  <p className={`text-xs ${theme.mobileUserMuted}`}>{user.email}</p>
                </div>
                <Link
                  href={getDashboardHref(user.role)}
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-3 font-medium transition-colors ${theme.mobileLink}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={onClose}
                  className={`block rounded-lg px-4 py-3 font-medium transition-colors ${theme.mobileLink}`}
                >
                  Profile
                </Link>
                {user.role !== "ADMIN" && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className={`block w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${theme.mobileSignOut}`}
                  >
                    Sign out
                  </button>
                )}
                {isFamily && !hasProvider && (
                  <>
                    <div className={`my-2 border-t ${theme.mobileDivider}`} />
                    <button
                      type="button"
                      onClick={() => {
                        onProviderClick();
                        onClose();
                      }}
                      className={`block w-full rounded-lg px-4 py-3 text-left font-medium transition-colors ${theme.mobileLink}`}
                    >
                      I&apos;m a Provider
                    </button>
                  </>
                )}
              </>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className={`block rounded-lg px-4 py-3 text-center font-medium transition-colors ${theme.mobileSignIn}`}
              >
                Sign In
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
