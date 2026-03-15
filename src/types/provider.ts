// ─── Provider types ───────────────────────────────────────────────────────────

export type ProviderStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface ApiProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  tax_id: string | null;
  address: string;
  city: string;
  country: string;
  verification_status: ProviderStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}




