import { Badge } from "../shared/Badge";
import { Loader } from "../shared/Loader";
import type { ApiTour } from "@/types";

interface ToursSectionProps {
  tours: ApiTour[];
  loading: boolean;
}

export function ToursSection({ tours, loading }: ToursSectionProps) {
  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Tour Requests</h2>
        <p className="text-sm text-slate-500">All tour bookings on the platform</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 sm:px-5 py-3 text-slate-500 font-medium">Tour ID</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Scheduled</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-5 py-4 text-slate-600 font-mono text-xs">
                    {t.id.slice(0, 12)}…
                  </td>
                  <td className="px-4 py-4 text-slate-600">{t.tour_type.replace("_", " ")}</td>
                  <td className="px-4 py-4 text-slate-600 hidden sm:table-cell">
                    {new Date(t.scheduled_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge status={t.status} />
                  </td>
                </tr>
              ))}
              {tours.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400">
                    No tours found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}






