"use client";

import Link from "next/link";
import { getLogoHref } from "../_lib/constants";
import { LogoIcon } from "./HeaderIcons";
import type { UserRole } from "@/types";

interface LogoProps {
  role: UserRole | undefined;
  textColor: string;
}

export function Logo({ role, textColor }: LogoProps) {
  const href = getLogoHref(role);

  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2"
      aria-label={role === "ADMIN" ? "Admin Dashboard" : role === "PROVIDER" ? "Provider Dashboard" : "Home"}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
        <LogoIcon className="h-5 w-5 text-white" />
      </div>
      <span className={`text-xl font-bold ${textColor}`}>Nook</span>
      {role === "ADMIN" && (
        <span className="ml-1 rounded-full bg-purple-600 px-2 py-0.5 text-xs font-semibold text-white">
          Admin
        </span>
      )}
    </Link>
  );
}
