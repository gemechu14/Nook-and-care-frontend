import { api } from "@/lib/axios";
import type {
  ApiListing,
  CreateListingRequest,
  UpdateListingRequest,
} from "@/types/listing";

export interface ListingsFilter {
  skip?: number;
  limit?: number;
  city?: string;
  state?: string;
  care_type?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  status?: string;
  search?: string;
}

export const listingsApi = {
  list: (params?: ListingsFilter): Promise<ApiListing[]> => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") q.set(k, String(v));
      });
    }
    const qs = q.toString();
    return api.get<ApiListing[]>(`/listings${qs ? `?${qs}` : ""}`);
  },

  featured: (): Promise<ApiListing[]> =>
    api.get<ApiListing[]>("/listings/featured"),

  getById: (id: string): Promise<ApiListing> =>
    api.get<ApiListing>(`/listings/${id}`),

  create: (data: CreateListingRequest): Promise<ApiListing> =>
    api.post<ApiListing>("/listings", data),

  update: (
    id: string,
    data: Partial<UpdateListingRequest>
  ): Promise<ApiListing> => api.put<ApiListing>(`/listings/${id}`, data),

  delete: (id: string): Promise<void> =>
    api.delete<void>(`/listings/${id}`),

  activate: (id: string): Promise<ApiListing> =>
    api.post<ApiListing>(`/listings/${id}/activate`),

  feature: (id: string, isFeatured: boolean): Promise<ApiListing> =>
    api.post<ApiListing>(`/listings/${id}/feature?is_featured=${isFeatured}`),
};




