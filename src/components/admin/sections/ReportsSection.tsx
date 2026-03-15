import { Badge } from "../shared/Badge";
import { Loader } from "../shared/Loader";
import type { ApiReport } from "@/types";

interface ReportsSectionProps {
  reports: ApiReport[];
  loading: boolean;
}

export function ReportsSection({ reports, loading }: ReportsSectionProps) {
  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500">Flagged content reported by users</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 sm:px-5 py-3 text-slate-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Description</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Date</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-5 py-4">
                    <span className="text-xs font-semibold bg-red-50 text-red-700 px-2 py-1 rounded-full">
                      {r.report_type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 truncate max-w-[240px]">
                    {r.description}
                  </td>
                  <td className="px-4 py-4 text-slate-500 whitespace-nowrap hidden sm:table-cell">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge status={r.status} />
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400">
                    No reports found
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



