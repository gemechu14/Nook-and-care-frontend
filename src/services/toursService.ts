import { api } from "@/lib/axios";
import type { ApiTour } from "@/types/listing";

export interface CreateTourRequest {
  listing_id: string;
  booked_by_user_id: string;
  tour_type: "IN_PERSON" | "VIRTUAL";
  scheduled_at: string;
  notes?: string;
}

export const toursApi = {
  list: (params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<ApiTour[]> => {
    const q = new URLSearchParams();
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v !== undefined && q.set(k, String(v))
      );
    const qs = q.toString();
    return api.get<ApiTour[]>(`/tours${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string): Promise<ApiTour> =>
    api.get<ApiTour>(`/tours/${id}`),

  create: (data: CreateTourRequest): Promise<ApiTour> =>
    api.post<ApiTour>("/tours", data),

  approve: (id: string): Promise<ApiTour> =>
    api.post<ApiTour>(`/tours/${id}/approve`),

  cancel: (id: string): Promise<ApiTour> =>
    api.post<ApiTour>(`/tours/${id}/cancel`),

  complete: (id: string): Promise<ApiTour> =>
    api.post<ApiTour>(`/tours/${id}/complete`),
};







