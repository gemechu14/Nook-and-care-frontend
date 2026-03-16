import Link from "next/link";
import { Badge } from "../shared/Badge";
import { Loader } from "../shared/Loader";
import { CARE_TYPE_LABELS } from "@/types";
import type { ApiListing } from "@/types";

interface ListingsSectionProps {
  listings: ApiListing[];
  onActivate: (id: string) => void;
  loading: boolean;
}

export function ListingsSection({ listings, onActivate, loading }: ListingsSectionProps) {
  if (loading) return <Loader />;

  const pendingCount = listings.filter(l => l.status === "PENDING").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Listing Management</h2>
          <p className="text-sm text-slate-500">Review and approve listing submissions</p>
        </div>
        <Badge status={`${pendingCount} Pending`} />
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 sm:px-5 py-3 text-slate-500 font-medium">Listing</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Care Type</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium hidden md:table-cell">Location</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Price</th>
                <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
                <th className="text-right px-4 sm:px-5 py-3 text-slate-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr 
                  key={l.id} 
                  onClick={() => window.location.href = `/admin/listings/${l.id}`}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 sm:px-5 py-4">
                    <p className="font-medium text-slate-900 truncate max-w-[160px]">{l.title}</p>
                    <p className="text-xs text-slate-400">{l.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                    {CARE_TYPE_LABELS[l.care_type]}
                  </td>
                  <td className="px-4 py-4 text-slate-600 whitespace-nowrap hidden md:table-cell">
                    {[l.city, l.state].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-700 font-medium whitespace-nowrap hidden sm:table-cell">
                    {l.price ? `$${l.price.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge status={l.status} />
                  </td>
                  <td className="px-4 sm:px-5 py-4 text-right">
                    <Link 
                      href={`/admin/listings/${l.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors inline-block"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {listings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No listings found
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




