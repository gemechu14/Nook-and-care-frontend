import { api } from "@/lib/axios";
import type { ApiTour } from "@/types/listing";

export interface CreateTourRequest {
  listing_id: string;
  booked_by_user_id: string;
  tour_type: "IN_PERSON" | "VIRTUAL";
  scheduled_at: string;
  notes?: string;
}

type ToursListResponse =
  | ApiTour[]
  | {
      items?: ApiTour[];
      results?: ApiTour[];
      data?: ApiTour[];
    };

function normalizeToursListResponse(payload: ToursListResponse): ApiTour[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

export const toursApi = {
  list: async (params?: {
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
    const res = await api.get<ToursListResponse>(`/tours${qs ? `?${qs}` : ""}`);
    return normalizeToursListResponse(res);
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







