import Link from "next/link";
import { Badge } from "./shared/Badge";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { CARE_TYPE_LABELS } from "@/types";
import type { ApiListing, ApiProvider, ApiTour } from "@/types";

interface DashboardOverviewProps {
  stats: Array<{
    label: string;
    value: number;
    trend: string;
    trendDirection: "up" | "down" | "flat";
    icon: React.ReactNode;
  }>;
  listings: ApiListing[];
  tours: ApiTour[];
  providers: ApiProvider[];
  loading: boolean;
  onActivate: (id: string) => void;
  onNavChange: (id: string) => void;
}

export function DashboardOverview({
  stats,
  listings,
  tours,
  providers,
  loading,
  onActivate,
  onNavChange,
}: DashboardOverviewProps) {
  const pendingListings = listings
    .filter((l) => l.status === "PENDING")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  const recentTours = tours
    .slice()
    .sort((a, b) => {
      const aDate = new Date(a.scheduled_at || a.preferred_date || 0).getTime();
      const bDate = new Date(b.scheduled_at || b.preferred_date || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <DashboardStats stats={stats} />

      <DashboardCharts listings={listings} providers={providers} loading={loading} />

      {/* Pending listings + Recent tours */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Pending listings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-slate-900">Pending Approvals</span>
            </div>
            <button 
              onClick={() => onNavChange("listings")} 
              className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pendingListings.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No pending listings</p>
            ) : (
              pendingListings.map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/listings/${l.id}`}
                  className="block px-4 sm:px-5 py-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{l.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {CARE_TYPE_LABELS[l.care_type]}{" "}
                        <span className="mx-2 text-slate-300">•</span>
                        {[l.city, l.state].filter(Boolean).join(", ") || "Location pending"}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Badge status="PENDING" />
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent tours */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-slate-900">Recent Tours</span>
            </div>
            <button 
              onClick={() => onNavChange("tours")} 
              className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentTours.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No tours yet</p>
            ) : (
              recentTours.map((t) => (
                <div key={t.id} className="px-4 sm:px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {t.booked_by?.full_name || t.family_name || "Family tour request"}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {t.scheduled_at
                          ? new Date(t.scheduled_at).toLocaleString()
                          : t.preferred_date
                            ? new Date(t.preferred_date).toLocaleDateString()
                            : "TBD"}
                        <span className="mx-2 text-slate-300">•</span>
                        {t.tour_type === "VIRTUAL" ? "Virtual" : "In person"}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Badge status={t.status} />
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




