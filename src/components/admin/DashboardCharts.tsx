import { BarChart } from "./shared/BarChart";
import type { ApiListing, ApiProvider } from "@/types";

interface DashboardChartsProps {
  listings: ApiListing[];
  providers: ApiProvider[];
  loading: boolean;
}

export function DashboardCharts({ listings, providers, loading }: DashboardChartsProps) {
  // Build monthly chart data from listing created_at (last 6 months)
  const chartData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return listings.filter((l) => {
        const d = new Date(l.created_at);
        return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
      }).length;
    });
  })();

  // Top providers by listing count
  const topProviders = providers
    .map((p) => ({ ...p, count: listings.filter((l) => l.provider_id === p.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCount = Math.max(...topProviders.map((p) => p.count), 1);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Monthly listings chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Monthly Listings Created</h3>
          <span className="text-xs text-slate-400">Last 6 months</span>
        </div>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <BarChart values={chartData} />
        )}
      </div>

      {/* Top providers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Top Providers by Listings</h3>
        <div className="space-y-3">
          {topProviders.map((p, i) => (
            <div key={p.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-600 truncate max-w-[130px]">
                  <span className="text-slate-400 mr-1">#{i + 1}</span> {p.business_name}
                </span>
                <span className="text-xs font-semibold text-slate-700">{p.count} listings</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${(p.count / maxCount) * 100}%` }} 
                />
              </div>
            </div>
          ))}
          {topProviders.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No data</p>
          )}
        </div>
      </div>
    </div>
  );
}



