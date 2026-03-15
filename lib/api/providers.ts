import { api } from "@/lib/apiClient";
import type { ApiProvider } from "@/types";

export interface CreateProviderRequest {
  business_name: string; business_type: string;
  tax_id?: string; address: string; city: string; country: string;
}

export const providersApi = {
  list: (params?: { skip?: number; limit?: number; status?: string }): Promise<ApiProvider[]> => {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    const qs = q.toString();
    return api.get<ApiProvider[]>(`/providers${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string): Promise<ApiProvider> => api.get<ApiProvider>(`/providers/${id}`),

  getMyProfile: (): Promise<ApiProvider> => api.get<ApiProvider>("/providers/me"),

  create: (data: CreateProviderRequest): Promise<ApiProvider> =>
    api.post<ApiProvider>("/providers", data),

  update: (id: string, data: Partial<CreateProviderRequest>): Promise<ApiProvider> =>
    api.put<ApiProvider>(`/providers/${id}`, data),

  verify: (id: string): Promise<ApiProvider> =>
    api.post<ApiProvider>(`/providers/${id}/verify`),

  reject: (id: string, reason?: string): Promise<ApiProvider> =>
    api.post<ApiProvider>(`/providers/${id}/reject`, reason ? { reason } : undefined),
};

