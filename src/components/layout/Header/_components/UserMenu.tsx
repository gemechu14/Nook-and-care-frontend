"use client";

import Link from "next/link";
import { getDashboardHref, getRoleBadgeClass, getRoleBadgeText } from "../_lib/constants";
import { getHeaderTheme } from "../_lib/theme";
import { ChevronDownIcon, DashboardIcon, ProfileIcon, LogoutIcon } from "./HeaderIcons";
import type { ApiUser } from "@/types";

interface UserMenuProps {
  user: ApiUser;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
  isWhiteHeader: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export function UserMenu({
  user,
  isOpen,
  onToggle,
  onClose,
  onLogout,
  isWhiteHeader,
  menuRef,
}: UserMenuProps) {
  const theme = getHeaderTheme(isWhiteHeader);
  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative" ref={menuRef as React.RefObject<HTMLDivElement>}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div
          className={`flex h-9 w-9 select-none items-center justify-center rounded-full text-sm font-bold text-white ${getRoleBadgeClass(user.role)}`}
        >
          {initials}
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 ${theme.icon} transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{user.full_name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${theme.roleBadge(user.role)}`}
            >
              {getRoleBadgeText(user.role)}
            </span>
          </div>
          <Link
            href={getDashboardHref(user.role)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            onClick={onClose}
          >
            <DashboardIcon className="h-4 w-4 text-slate-400" />
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            onClick={onClose}
          >
            <ProfileIcon className="h-4 w-4 text-slate-400" />
            Profile
          </Link>
          {user.role !== "ADMIN" && (
            <div className="mt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogoutIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
