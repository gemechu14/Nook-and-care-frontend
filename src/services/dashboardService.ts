import { api } from "@/lib/axios";

export interface DashboardSummary {
  total_listings: number;
  active_listings: number;
  pending_listings: number;
  total_tours: number;
}

export interface AdminSummaryTrend {
  this_week: number;
  previous_week: number;
  delta: number;
  delta_label: string;
  percent_change: number;
  percent_label: string;
  direction: "up" | "down" | "flat";
}

export interface AdminDashboardSummary {
  total_providers: number;
  pending_providers: number;
  active_providers: number;
  total_active_listings: number;
  total_reports: number;
  trends: {
    total_providers: AdminSummaryTrend;
    total_active_listings: AdminSummaryTrend;
    total_reports: AdminSummaryTrend;
  };
}

export const dashboardApi = {
  summary: (): Promise<DashboardSummary> =>
    api.get<DashboardSummary>("/dashboard/summary"),
  adminSummary: (): Promise<AdminDashboardSummary> =>
    api.get<AdminDashboardSummary>("/dashboard/admin/summary"),
};

