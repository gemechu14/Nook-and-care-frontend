"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "../shared/Badge";
import { Loader } from "../shared/Loader";
import { CARE_TYPE_LABELS } from "@/types";
import { useGetListingsQuery } from "@/store/listingsApi";

interface ListingsSectionProps {
  loading?: boolean;
}

export function ListingsSection({ loading = false }: ListingsSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50 | 100>(10);
  const [query, setQuery] = useState("");

  const { data, isLoading, isFetching, isError } = useGetListingsQuery({
    page,
    size: pageSize,
    include_all_statuses: true,
  });

  const listings = useMemo(() => {
    const items = data?.items ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((l) => {
      const text = `${l.title} ${l.city ?? ""} ${l.state ?? ""} ${l.care_type} ${l.status}`.toLowerCase();
      return text.includes(q);
    });
  }, [data?.items, query]);

  const pendingCount = (data?.items ?? []).filter((l) => l.status === "PENDING").length;
  const totalCount = data?.total;
  const totalPages = data?.totalPages;
  const hasNextPage = data?.hasNextPage ?? false;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem =
    totalCount !== null && totalCount !== undefined
      ? Math.min(page * pageSize, totalCount)
      : (page - 1) * pageSize + listings.length;

  const pageItems = useMemo((): Array<number | "..."> => {
    if (!totalPages || totalPages <= 1) return [1];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items: Array<number | "..."> = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    if (left > 2) items.push("...");
    for (let p = left; p <= right; p++) items.push(p);
    if (right < totalPages - 1) items.push("...");
    items.push(totalPages);
    return items;
  }, [page, totalPages]);

  if (loading || (isLoading && !data)) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Listing Management</h2>
          <p className="text-sm text-slate-500">Review and approve listing submissions</p>
        </div>
        <Badge status={`${pendingCount} Pending`} />
      </div>

      {isError ? (
        <div className="bg-white rounded-xl border border-red-200 p-4 text-sm text-red-700">
          Failed to load listings. Please try again.
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, city, status..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              disabled={isFetching}
            />
          </div>
        </div>
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
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
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
                      href={`/admin/listings/${l.id}/view`}
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="text-sm text-slate-500 whitespace-nowrap">
              Showing{" "}
              <span className="font-medium text-slate-700">{startItem}</span>-
              <span className="font-medium text-slate-700">{endItem}</span> of{" "}
              <span className="font-medium text-slate-700">
                {totalCount ?? "many"}
              </span>
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
              disabled={page === 1 || isFetching}
              className="h-9 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {totalPages && totalPages > 1 && (
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
                      disabled={isFetching}
                      className={[
                        "h-9 min-w-9 px-3 rounded-lg text-sm font-medium border",
                        it === page
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {it}
                    </button>
                  )
                )}
              </div>
            )}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage || isFetching}
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




