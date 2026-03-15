/** Typed route constants for the application */
export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  LISTING: (id: string) => `/listings/${id}`,
  ABOUT: "/about",
  CONTACT: "/contact",
  HOW_IT_WORKS: "/how-it-works",
  RESOURCES: "/resources",
  ASSESSMENT: "/assessment",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // User
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  // Provider
  PROVIDERS_REGISTER: "/providers/register",
  PROVIDERS_DASHBOARD: "/providers/dashboard",
  PROVIDER_LISTING: (id: string) => `/providers/listings/${id}`,

  // Admin
  ADMIN: "/admin",
} as const;




