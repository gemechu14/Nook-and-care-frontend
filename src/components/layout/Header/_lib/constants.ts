import type { UserRole } from "@/types";

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
] as const;

export const FACILITY_TYPES = [
  "Assisted Living",
  "Memory Care",
  "Independent Living",
  "Adult Family Home",
  "Skilled Nursing Facility",
  "Continuing Care Retirement Community",
  "Other",
] as const;


export function isWhiteHeaderPath(pathname: string | null, isScrolled: boolean): boolean {
  if (!pathname) return false;
  const exact = ["/search", "/assessment", "/how-it-works", "/resources", "/favorites", "/dashboard", "/profile", "/admin"];
  const prefix = ["/listings/", "/providers/dashboard", "/providers/listings"];
  if (exact.includes(pathname)) return true;
  if (prefix.some((p) => pathname.startsWith(p))) return true;
  if (pathname === "/" && isScrolled) return true;
  return false;
}

export function isAuthPage(pathname: string | null): boolean {
  if (!pathname) return false;
  return ["/login", "/register", "/forgot-password"].includes(pathname);
}

export const PHONE_NUMBER = "1-800-555-0123";

export interface NavItem {
  label: string;
  href: string;
}

export function getNavItems(role: UserRole | undefined): NavItem[] {
  if (!role) {
    return [
      { label: "Find Care", href: "/search" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "Resources", href: "/resources" },
      { label: "Assessment", href: "/assessment" },
    ];
  }
  if (role === "ADMIN") {
    return [{ label: "Admin Dashboard", href: "/admin" }];
  }
  if (role === "PROVIDER") {
    return [
      { label: "Find Care", href: "/search" },
      { label: "List Your Facility", href: "/providers/dashboard?addListing=true" },
    ];
  }
  return [
    { label: "Find Care", href: "/search" },
    { label: "Favorites", href: "/favorites" },
  ];
}

export function getLogoHref(role: UserRole | undefined): string {
  if (role === "ADMIN") return "/admin";
  if (role === "PROVIDER") return "/providers/dashboard";
  return "/";
}

export function getDashboardHref(role: UserRole | undefined): string {
  if (role === "ADMIN") return "/admin";
  if (role === "PROVIDER") return "/providers/dashboard";
  return "/dashboard";
}

export function getRoleBadgeClass(role: UserRole | undefined): string {
  if (role === "ADMIN") return "bg-purple-600";
  if (role === "PROVIDER") return "bg-blue-600";
  return "bg-teal-600";
}

export function getRoleBadgeText(role: UserRole | undefined): string {
  if (role === "ADMIN") return "Administrator";
  if (role === "PROVIDER") return "Provider";
  if (role === "SENIOR") return "Senior";
  return "Family Member";
}
