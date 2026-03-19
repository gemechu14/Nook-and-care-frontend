import { api } from "@/lib/axios";

export interface DashboardSummary {
  total_listings: number;
  active_listings: number;
  pending_listings: number;
  total_tours: number;
}

export const dashboardApi = {
  summary: (): Promise<DashboardSummary> =>
    api.get<DashboardSummary>("/dashboard/summary"),
};

