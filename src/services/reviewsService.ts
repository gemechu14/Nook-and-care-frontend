import { api } from "@/lib/axios";
import type { ApiReview } from "@/types/listing";

export interface CreateReviewRequest {
  listing_id: string;
  rating: number;
  comment?: string;
  tour_id?: string;
}

export type ReviewsListingResponse =
  | ApiReview[]
  | {
      items?: ApiReview[];
      results?: ApiReview[];
      data?: ApiReview[];
      total?: number;
      page?: number;
      size?: number;
      pages?: number;
      next_page?: number | null;
      prev_page?: number | null;
    };

export const reviewsApi = {
  list: (params?: {
    listing_id?: string;
    skip?: number;
    limit?: number;
  }): Promise<ApiReview[]> => {
    const q = new URLSearchParams();
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v !== undefined && q.set(k, String(v))
      );
    const qs = q.toString();
    return api.get<ApiReview[]>(`/reviews${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string): Promise<ApiReview> =>
    api.get<ApiReview>(`/reviews/${id}`),

  create: (data: CreateReviewRequest): Promise<ApiReview> =>
    api.post<ApiReview>("/reviews", data),

  update: (
    id: string,
    data: Partial<CreateReviewRequest & { provider_response?: string }>
  ): Promise<ApiReview> => api.put<ApiReview>(`/reviews/${id}`, data),

  delete: (id: string): Promise<void> =>
    api.delete<void>(`/reviews/${id}`),

  /** Public listing reviews endpoint (paginated) */
  listByListing: (listingId: string, params?: { page?: number; size?: number }): Promise<ReviewsListingResponse> => {
    const page = params?.page ?? 1;
    const size = params?.size ?? 20;
    return api.get<ReviewsListingResponse>(`/reviews/listing/${listingId}?page=${page}&size=${size}`);
  },
};







