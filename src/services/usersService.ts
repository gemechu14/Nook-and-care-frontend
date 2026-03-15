import { api } from "@/lib/axios";
import type { ApiUser } from "@/types/user";

export const usersApi = {
  getById: (id: string): Promise<ApiUser> =>
    api.get<ApiUser>(`/users/${id}`),

  update: (
    id: string,
    data: Partial<{ full_name: string; phone: string; role: string }>
  ): Promise<ApiUser> => api.put<ApiUser>(`/users/${id}`, data),

  list: (params?: {
    skip?: number;
    limit?: number;
    role?: string;
  }): Promise<ApiUser[]> => {
    const q = new URLSearchParams();
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v !== undefined && q.set(k, String(v))
      );
    const qs = q.toString();
    return api.get<ApiUser[]>(`/users${qs ? `?${qs}` : ""}`);
  },
};

