import Link from "next/link";
import { Badge } from "./shared/Badge";
import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { CARE_TYPE_LABELS } from "@/types";
import type { ApiListing, ApiTour } from "@/types";

interface DashboardOverviewProps {
  stats: Array<{
    label: string;
    value: number;
    trend: string;
    trendUp: boolean;
    icon: React.ReactNode;
  }>;
  listings: ApiListing[];
  tours: ApiTour[];
  providers: any[];
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
  const pendingListings = listings.filter((l) => l.status === "PENDING").slice(0, 5);
  const recentTours = tours.slice(0, 4);

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
                  className="flex items-center justify-between px-4 sm:px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{l.title}</p>
                    <p className="text-xs text-slate-400">
                      {CARE_TYPE_LABELS[l.care_type]} · {[l.city, l.state].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge status="PENDING" />
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
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div key={t.id} className="flex items-center justify-between px-4 sm:px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{t.tour_type.replace("_", " ")}</p>
                    <p className="text-xs text-slate-400">{new Date(t.scheduled_at).toLocaleDateString()}</p>
                  </div>
                  <Badge status={t.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




