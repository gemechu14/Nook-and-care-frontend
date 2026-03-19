"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "../shared/Badge";
import { Loader } from "../shared/Loader";
import type { ApiProvider } from "@/types";

interface ProvidersSectionProps {
  providers: ApiProvider[];
  onVerify: (id: string) => void;
  loading: boolean;
}

export function ProvidersSection({ providers, onVerify, loading }: ProvidersSectionProps) {
  const [menuState, setMenuState] = useState<{
    id: string;
    top: number;
    left: number;
    openUp: boolean;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50 | 100>(10);
  if (loading) return <Loader />;

  const pendingCount = providers.filter(p => p.verification_status === "PENDING").length;
  const total = providers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageProviders = providers.slice(startIndex, endIndex);

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
          <h2 className="text-lg font-bold text-slate-900">Provider Management</h2>
          <p className="text-sm text-slate-500">Review and verify provider applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge status={`${pendingCount} Pending`} />
          <Badge status={`${total} Total`} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-visible shadow-sm">
        <div className="overflow-x-auto overflow-y-visible">
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
              {pageProviders.map((p) => (
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
                    <div className="flex justify-end">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            const estimatedMenuHeight =
                              p.verification_status === "VERIFIED" ? 52 : 92;
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const openUp = spaceBelow < estimatedMenuHeight + 12;
                            setMenuState((current) =>
                              current?.id === p.id
                                ? null
                                : {
                                    id: p.id,
                                    top: openUp ? rect.top - 8 : rect.bottom + 8,
                                    left: rect.right,
                                    openUp,
                                  }
                            );
                          }}
                          className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                          aria-label="Actions"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {pageProviders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No providers found
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
              {pageItems.map((it, idy) =>
                it === "..." ? (
                  <span key={`dots-${idy}`} className="px-2 text-slate-400">
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

      {menuState && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMenuState(null)} />
          <div
            className="fixed z-40 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
            style={{
              top: menuState.openUp ? undefined : menuState.top,
              bottom: menuState.openUp ? window.innerHeight - menuState.top : undefined,
              left: menuState.left,
              transform: "translateX(-100%)",
            }}
          >
            <Link
              href={`/admin/providers/${menuState.id}`}
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={() => setMenuState(null)}
            >
              View
            </Link>
            {providers.find((provider) => provider.id === menuState.id)?.verification_status !== "VERIFIED" && (
              <button
                type="button"
                onClick={async () => {
                  const id = menuState.id;
                  setMenuState(null);
                  await onVerify(id);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Verify
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}






