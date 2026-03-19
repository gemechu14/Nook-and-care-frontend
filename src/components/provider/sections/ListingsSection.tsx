import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/admin/shared/Badge";
import { Loader } from "@/components/admin/shared/Loader";
import { CARE_TYPE_LABELS } from "@/types";
import type { ApiListing } from "@/types";

interface ListingsSectionProps {
  listings: ApiListing[];
  loading: boolean;
  onImageManage?: (listing: ApiListing) => void;
  onAddListing?: () => void;
}

export function ListingsSection({ listings, loading, onAddListing }: ListingsSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50 | 100>(10);

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(listings.length / pageSize));
    if (page > nextTotalPages) {
      setPage(nextTotalPages);
    }
  }, [listings.length, page, pageSize]);

  if (loading) return <Loader />;

  const activeCount = listings.filter(l => l.status === "ACTIVE").length;
  const pendingCount = listings.filter(l => l.status === "PENDING").length;
  const total = listings.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageListings = listings.slice(startIndex, endIndex);

  const pageItems = useMemo((): Array<number | "..."> => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items: Array<number | "..."> = [1];
    const left = Math.max(2, safePage - 1);
    const right = Math.min(totalPages - 1, safePage + 1);
    if (left > 2) items.push("...");
    for (let p = left; p <= right; p++) items.push(p);
    if (right < totalPages - 1) items.push("...");
    items.push(totalPages);
    return items;
  }, [safePage, totalPages]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Your Listings</h2>
          <p className="text-sm text-slate-500">Manage and update your facility listings</p>
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Badge status={`${activeCount} Active`} />
          )}
          {pendingCount > 0 && (
            <Badge status={`${pendingCount} Pending`} />
          )}
        </div>
      </div>

      {onAddListing && (
        <div className="flex justify-end">
          <button 
            onClick={onAddListing}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Listing
          </button>
        </div>
      )}
      
      {listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-lg font-medium text-slate-900 mb-2">No listings yet</p>
          <p className="text-sm text-slate-500 mb-6">Create your first listing to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
                {pageListings.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-5 py-4">
                      <p className="font-medium text-slate-900 truncate max-w-[180px]">{l.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">ID: {l.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                      {CARE_TYPE_LABELS[l.care_type] ?? l.care_type}
                    </td>
                    <td className="px-4 py-4 text-slate-600 whitespace-nowrap hidden md:table-cell">
                      {[l.city, l.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-700 font-medium whitespace-nowrap hidden sm:table-cell">
                      {l.price ? `$${l.price.toLocaleString()}/mo` : "—"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge status={l.status} />
                      {l.status === "PENDING" && (
                        <p className="text-xs text-amber-600 mt-1 whitespace-nowrap">Under review</p>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-4">
                      <div className="flex items-center justify-end">
                        <Link 
                          href={`/providers/listings/${l.id}`} 
                          className="text-xs font-medium px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:border-teal-300 hover:text-teal-600 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-t border-slate-100 bg-white">
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <div className="text-sm text-slate-500 whitespace-nowrap">
                Showing{" "}
                <span className="font-medium text-slate-700">{total === 0 ? 0 : startIndex + 1}</span>-
                <span className="font-medium text-slate-700">{endIndex}</span> of{" "}
                <span className="font-medium text-slate-700">{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 whitespace-nowrap">Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const next = Number(e.target.value) as 10 | 20 | 50 | 100;
                    setPageSize(next);
                    setPage(1);
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="h-9 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {pageItems.map((it, idx) =>
                  it === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={it}
                      onClick={() => setPage(it)}
                      className={[
                        "h-9 min-w-9 px-3 rounded-lg text-sm font-medium border",
                        it === safePage
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {it}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="h-9 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

