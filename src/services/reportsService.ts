import { api } from "@/lib/axios";
import type { ApiReport } from "@/types/listing";

export interface CreateReportRequest {
  listing_id?: string;
  provider_id?: string;
  report_type:
    | "FAKE_LISTING"
    | "SCAM_PROVIDER"
    | "MISLEADING_IMAGES"
    | "FRAUD"
    | "OTHER";
  description: string;
}

export const reportsApi = {
  list: (params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiReport[]> => {
    const q = new URLSearchParams();
    if (params)
      Object.entries(params).forEach(
        ([k, v]) => v !== undefined && q.set(k, String(v))
      );
    const qs = q.toString();
    return api.get<ApiReport[]>(`/reports${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string): Promise<ApiReport> =>
    api.get<ApiReport>(`/reports/${id}`),

  create: (data: CreateReportRequest): Promise<ApiReport> =>
    api.post<ApiReport>("/reports", data),
};






