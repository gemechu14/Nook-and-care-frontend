import { api } from "@/lib/axios";
import type { ApiProvider } from "@/types/provider";

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateProviderRequest {
  user_id: string;
  business_name: string;
  business_type: string;
  tax_id?: string;
  address: string;
  city: string;
  country: string;
}

// ─── Providers API ────────────────────────────────────────────────────────────

export const providersApi = {
  list: (
    params?: { skip?: number; limit?: number; status?: string }
  ): Promise<ApiProvider[]> => {
    const q = new URLSearchParams();
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v !== undefined && q.set(k, String(v))
      );
    const qs = q.toString();
    return api.get<ApiProvider[]>(`/providers${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string): Promise<ApiProvider> =>
    api.get<ApiProvider>(`/providers/${id}`),

  create: async (data: CreateProviderRequest): Promise<ApiProvider> => {
    const cleanedData: Record<string, unknown> = {
      user_id: data.user_id,
      business_name: data.business_name.trim(),
      business_type: data.business_type.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      country: data.country.trim() || "USA",
    };
    if (data.tax_id && data.tax_id.trim()) {
      cleanedData.tax_id = data.tax_id.trim();
    }
    return api.post<ApiProvider>("/providers", cleanedData);
  },

  update: (
    id: string,
    data: Partial<CreateProviderRequest>
  ): Promise<ApiProvider> => api.put<ApiProvider>(`/providers/${id}`, data),

  verify: (id: string): Promise<ApiProvider> =>
    api.post<ApiProvider>(`/providers/${id}/verify`),

  reject: (id: string, reason?: string): Promise<ApiProvider> =>
    api.post<ApiProvider>(
      `/providers/${id}/reject`,
      reason ? { reason } : undefined
    ),
};






