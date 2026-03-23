"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/admin/shared/Badge";
import { Loader } from "@/components/admin/shared/Loader";
import type { ApiTour } from "@/types";
import {
  useApproveTourMutation,
  useCompleteTourMutation,
  useGetToursQuery,
  type ToursPageResponse,
} from "@/store/toursApi";

interface ToursSectionProps {
  providerId: string;
}

export function ToursSection({ providerId }: ToursSectionProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50 | 100>(10);
  const [query, setQuery] = useState("");
  const [menuOpenForId, setMenuOpenForId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetToursQuery(
    { page, size: pageSize },
    { skip: !providerId }
  );
  const toursPage = data as ToursPageResponse | undefined;

  const [approveTour] = useApproveTourMutation();
  const [completeTour] = useCompleteTourMutation();

  const sortedTours = useMemo(() => {
    return [...(toursPage?.items ?? [])].sort((a, b) => {
      const aTime = new Date(a.created_at || a.updated_at).getTime();
      const bTime = new Date(b.created_at || b.updated_at).getTime();
      return bTime - aTime;
    });
  }, [toursPage?.items]);

  const filteredTours = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedTours;
    return sortedTours.filter((t) => {
      const name = (t.booked_by?.full_name || t.family_name || "").toLowerCase();
      const email = (t.booked_by?.email || t.family_email || "").toLowerCase();
      const phone = (t.booked_by?.phone || t.family_phone || "").toLowerCase();
      const status = (t.status || "").toLowerCase();
      const type = (t.tour_type || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        status.includes(q) ||
        type.includes(q)
      );
    });
  }, [query, sortedTours]);

  const pageTours = filteredTours;
  const hasNextPage = toursPage?.hasNextPage ?? false;
  const totalCount = toursPage?.total;
  const totalPages = toursPage?.totalPages;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem =
    totalCount !== null && totalCount !== undefined
      ? Math.min(page * pageSize, totalCount)
      : (page - 1) * pageSize + pageTours.length;

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

  const handleApprove = async (id: string) => {
    try {
      await approveTour(id).unwrap();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve tour");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeTour(id).unwrap();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to complete tour");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Tour Requests</h2>
        <p className="text-sm text-slate-500">Manage tour bookings from families</p>
      </div>

      {isLoading && !toursPage?.items ? (
        <Loader />
      ) : isError ? (
        <div className="bg-white rounded-xl border border-red-200 p-4 text-sm text-red-700">
          Failed to load tour requests. Please try again.
        </div>
      ) : !toursPage || toursPage.items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-lg font-medium text-slate-900 mb-2">No tour requests yet</p>
          <p className="text-sm text-slate-500">Tour requests from families will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
              <div className="relative flex-1 max-w-md">
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search name, phone, email, status..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  disabled={isFetching}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left font-semibold px-4 sm:px-5 py-3">Fullname</th>
                  <th className="text-left font-semibold px-4 sm:px-5 py-3">Phone</th>
                  <th className="text-left font-semibold px-4 sm:px-5 py-3">Email</th>
                  <th className="text-left font-semibold px-4 sm:px-5 py-3">Tour Date</th>
                  <th className="text-left font-semibold px-4 sm:px-5 py-3">Type</th>
                  <th className="text-left font-semibold px-4 sm:px-5 py-3">Status</th>
                  <th className="text-right font-semibold px-4 sm:px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageTours.map((tour) => {
                  const fullName = tour.booked_by?.full_name || tour.family_name || "—";
                  const phone = tour.booked_by?.phone || tour.family_phone || "—";
                  const email = tour.booked_by?.email || tour.family_email || "—";
                  const tourDate = tour.scheduled_at
                    ? new Date(tour.scheduled_at).toLocaleString()
                    : tour.preferred_date
                      ? new Date(tour.preferred_date).toLocaleDateString()
                      : "TBD";

                  return (
                    <tr key={tour.id} className="hover:bg-slate-50/50">
                      <td className="px-4 sm:px-5 py-3">
                        <div className="font-medium text-slate-900">{fullName}</div>
                      </td>
                      <td className="px-4 sm:px-5 py-3 text-slate-700">{phone}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-700">{email}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-700">{tourDate}</td>
                      <td className="px-4 sm:px-5 py-3 text-slate-700">
                        {tour.tour_type === "VIRTUAL" ? "Virtual" : "In person"}
                      </td>
                      <td className="px-4 sm:px-5 py-3">
                        <Badge status={tour.status} />
                      </td>
                      <td className="px-4 sm:px-5 py-3">
                        <div className="flex justify-end">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setMenuOpenForId((cur) => (cur === tour.id ? null : tour.id))}
                              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                              aria-label="Actions"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>

                            {menuOpenForId === tour.id && (
                              <div
                                className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-10"
                                onMouseLeave={() => setMenuOpenForId(null)}
                              >
                                <Link
                                  href={`/providers/dashboard/tours/${tour.id}`}
                                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                  onClick={() => setMenuOpenForId(null)}
                                >
                                  View
                                </Link>
                                {tour.status === "PENDING" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        setMenuOpenForId(null);
                                        await handleApprove(tour.id);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                      Approve
                                    </button>
                                  </>
                                )}
                                {tour.status === "APPROVED" && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      setMenuOpenForId(null);
                                      await handleComplete(tour.id);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                                  >
                                    Mark Complete
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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




