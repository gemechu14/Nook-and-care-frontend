import { api } from "@/lib/apiClient";
import type { ApiReview } from "@/types";

export interface CreateReviewRequest {
  listing_id: string; rating: number; comment?: string; tour_id?: string;
}

export const reviewsApi = {
  list: (params?: { listing_id?: string; skip?: number; limit?: number }): Promise<ApiReview[]> => {
    const q = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && q.set(k, String(v)));
    const qs = q.toString();
    return api.get<ApiReview[]>(`/reviews${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string): Promise<ApiReview> => api.get<ApiReview>(`/reviews/${id}`),
  create: (data: CreateReviewRequest): Promise<ApiReview> => api.post<ApiReview>("/reviews", data),
  update: (id: string, data: Partial<CreateReviewRequest & { provider_response?: string }>): Promise<ApiReview> =>
    api.put<ApiReview>(`/reviews/${id}`, data),
  delete: (id: string): Promise<void> => api.delete<void>(`/reviews/${id}`),
};

