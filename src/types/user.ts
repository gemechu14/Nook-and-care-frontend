// ─── User types ───────────────────────────────────────────────────────────────

export type UserRole = "FAMILY" | "SENIOR" | "PROVIDER" | "ADMIN";

export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}






