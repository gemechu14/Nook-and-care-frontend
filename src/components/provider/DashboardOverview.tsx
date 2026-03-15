import { Badge } from "@/components/admin/shared/Badge";
import type { ApiListing, ApiTour, ApiProvider } from "@/types";

interface DashboardOverviewProps {
  stats: Array<{
    label: string;
    value: number | string;
    icon: React.ReactNode;
  }>;
  listings: ApiListing[];
  tours: ApiTour[];
  provider: ApiProvider | null;
  loading: boolean;
}

export function DashboardOverview({ stats, listings, tours, provider, loading }: DashboardOverviewProps) {
  const recentListings = listings.slice(0, 5);
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                {icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {typeof value === "number" ? value : <Badge status={value} />}
            </p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Listings + Recent Tours */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Listings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold text-slate-900">Recent Listings</span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recentListings.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-400">No listings yet</p>
            ) : (
              recentListings.map((l) => (
                <div key={l.id} className="flex items-center justify-between px-4 sm:px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{l.title}</p>
                    <p className="text-xs text-slate-400">{l.city && l.state ? `${l.city}, ${l.state}` : "—"}</p>
                  </div>
                  <Badge status={l.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tours */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-slate-900">Recent Tours</span>
            </div>
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
                    <p className="text-sm font-medium text-slate-900">{t.family_name || "Family Member"}</p>
                    <p className="text-xs text-slate-400">
                      {t.preferred_date ? new Date(t.preferred_date).toLocaleDateString() : "TBD"}
                    </p>
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

