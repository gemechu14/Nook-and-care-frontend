import { Badge } from "../shared/Badge";
import { Loader } from "../shared/Loader";
import type { ApiProvider } from "@/types";

interface ProvidersSectionProps {
  providers: ApiProvider[];
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}

export function ProvidersSection({ providers, onVerify, onReject, loading }: ProvidersSectionProps) {
  if (loading) return <Loader />;

  const pendingCount = providers.filter(p => p.verification_status === "PENDING").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Provider Management</h2>
          <p className="text-sm text-slate-500">Review and verify provider applications</p>
        </div>
        <Badge status={`${pendingCount} Pending`} />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 sm:px-5 py-3 text-slate-500 font-medium">Business</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">City</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
                <th className="text-right px-4 sm:px-5 py-3 text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 sm:px-5 py-4">
                    <p className="font-medium text-slate-900">{p.business_name}</p>
                    <p className="text-xs text-slate-400">ID: {p.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{p.business_type}</td>
                  <td className="px-4 py-4 text-slate-600 hidden sm:table-cell">{p.city}</td>
                  <td className="px-4 py-4 text-center">
                    <Badge status={p.verification_status} />
                  </td>
                  <td className="px-4 sm:px-5 py-4">
                    {p.verification_status === "PENDING" && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onVerify(p.id)}
                          className="text-xs font-medium px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => onReject(p.id)}
                          className="text-xs font-medium px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No providers found
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





