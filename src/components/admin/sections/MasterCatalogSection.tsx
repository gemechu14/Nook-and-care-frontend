"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { catalogApi } from "@/services/catalogService";
import { Loader } from "../shared/Loader";

import type {
  Amenity,
  Activity,
  Certification,
  DiningOption,
  Equipment,
  HouseRule,
  InsuranceOption,
  Language,
  SafetyFeature,
  TreatmentService,
} from "@/types";

type CatalogKey =
  | "amenities"
  | "activities"
  | "languages"
  | "certifications"
  | "diningOptions"
  | "safetyFeatures"
  | "insuranceOptions"
  | "houseRules"
  | "equipment"
  | "treatmentServices";

type CatalogItem =
  | Amenity
  | Activity
  | Language
  | Certification
  | DiningOption
  | SafetyFeature
  | InsuranceOption
  | HouseRule
  | Equipment
  | TreatmentService;

type CatalogMeta = {
  key: CatalogKey;
  label: string;
  helperText: string;
  icon: ReactNode;
  detailKind: "category" | "code" | "type" | "issuingOrDescription" | "none";
};

const ITEM_ROWS_PAGE_SIZES: Array<10 | 20 | 50 | 100> = [10, 20, 50, 100];

function getItemDetailText(item: CatalogItem, detailKind: CatalogMeta["detailKind"]): string | null {
  if (detailKind === "none") return null;

  if (detailKind === "category") {
    if ("category" in item) return item.category ? String(item.category) : null;
    return null;
  }

  if (detailKind === "code") {
    if ("code" in item) return item.code ? String(item.code) : null;
    return null;
  }

  if (detailKind === "type") {
    if ("type" in item) return item.type ? String(item.type) : null;
    return null;
  }

  if (detailKind === "issuingOrDescription") {
    if ("issuing_body" in item && item.issuing_body) return String(item.issuing_body);
    if ("description" in item && item.description) return String(item.description);
    return null;
  }

  return null;
}

async function listCatalogItems(key: CatalogKey, skip: number, limit: number): Promise<CatalogItem[]> {
  switch (key) {
    case "amenities": {
      const res = await catalogApi.amenities.list({ skip, limit });
      return res;
    }
    case "activities": {
      const res = await catalogApi.activities.list({ skip, limit });
      return res;
    }
    case "languages": {
      const res = await catalogApi.languages.list({ skip, limit });
      return res;
    }
    case "certifications": {
      const res = await catalogApi.certifications.list({ skip, limit });
      return res;
    }
    case "diningOptions": {
      const res = await catalogApi.diningOptions.list({ skip, limit });
      return res;
    }
    case "safetyFeatures": {
      const res = await catalogApi.safetyFeatures.list({ skip, limit });
      return res;
    }
    case "insuranceOptions": {
      const res = await catalogApi.insuranceOptions.list({ skip, limit });
      return res;
    }
    case "houseRules": {
      const res = await catalogApi.houseRules.list({ skip, limit });
      return res;
    }
    case "equipment": {
      const res = await catalogApi.equipment.list({ skip, limit });
      return res;
    }
    case "treatmentServices": {
      const res = await catalogApi.treatmentServices.list({ skip, limit });
      return res;
    }
    default: {
      // Exhaustive check
      return [];
    }
  }
}

export function MasterCatalogSection() {
  const CATALOGS: CatalogMeta[] = useMemo(
    () => [
      {
        key: "amenities",
        label: "Amenities",
        helperText: "Features used by listings",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21V8a2 2 0 00-2-2h-3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21V8a2 2 0 012-2h3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l3-3 3 3" />
          </svg>
        ),
      },
      {
        key: "activities",
        label: "Activities",
        helperText: "Programs and activities catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10h5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h3" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4l-6 6" />
          </svg>
        ),
      },
      {
        key: "languages",
        label: "Languages",
        helperText: "Supported languages for listings",
        detailKind: "code",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M7 9h10M7 13h10M7 17h6" />
          </svg>
        ),
      },
      {
        key: "certifications",
        label: "Certifications",
        helperText: "Licenses and certifications catalog",
        detailKind: "issuingOrDescription",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
          </svg>
        ),
      },
      {
        key: "diningOptions",
        label: "Dining Options",
        helperText: "Dining and meal options",
        detailKind: "none",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v7M12 5v14M18 5v7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5h12" />
          </svg>
        ),
      },
      {
        key: "safetyFeatures",
        label: "Safety Features",
        helperText: "Emergency and safety catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 18H9.5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 21h7L20 4l-8 2-8-2 3.5 17z" />
          </svg>
        ),
      },
      {
        key: "insuranceOptions",
        label: "Insurance Options",
        helperText: "Coverage and payment options",
        detailKind: "issuingOrDescription",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6l-1 4H10L9 4z" />
          </svg>
        ),
      },
      {
        key: "houseRules",
        label: "House Rules",
        helperText: "Policy rules and guidelines",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        ),
      },
      {
        key: "equipment",
        label: "Equipment",
        helperText: "Available equipment catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 4h4M12 8H8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-2-2h-6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16V8a2 2 0 012-2h6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16h10v4H7v-4z" />
          </svg>
        ),
      },
      {
        key: "treatmentServices",
        label: "Treatment Services",
        helperText: "Care and treatment services catalog",
        detailKind: "category",
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10h4v4h-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h6" />
          </svg>
        ),
      },
    ],
    []
  );

  const [selectedKey, setSelectedKey] = useState<CatalogKey>("amenities");
  const selectedMeta = useMemo(() => CATALOGS.find((c) => c.key === selectedKey)!, [CATALOGS, selectedKey]);

  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const [pageSize, setPageSize] = useState<10 | 20 | 50 | 100>(20);
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listCatalogItems(selectedKey, skip, pageSize);
        if (cancelled) return;
        setItems(res);
      } catch (e) {
        if (cancelled) return;
        setItems([]);
        setError(e instanceof Error ? e.message : "Failed to load catalog data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedKey, skip, pageSize]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const nameText = "name" in it ? String(it.name) : "";
      const detail = getItemDetailText(it, selectedMeta.detailKind) ?? "";
      return `${nameText} ${detail}`.toLowerCase().includes(q);
    });
  }, [items, query, selectedMeta.detailKind]);

  const page = Math.floor(skip / pageSize) + 1;
  const hasNext = items.length === pageSize;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Master Catalog</h2>
          <p className="text-sm text-slate-500">Manage the reference tables used across listings.</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs font-semibold text-slate-600">Current status</p>
            <p className="text-xs text-slate-500">View-only (CRUD coming soon)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {selectedMeta.key !== null && (
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                Selected: {selectedMeta.label}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATALOGS.map((c) => {
            const isActive = c.key === selectedKey;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setSelectedKey(c.key);
                  setSkip(0);
                  setQuery("");
                }}
                className={[
                  "text-left rounded-2xl border px-4 py-3 transition-colors",
                  isActive
                    ? "border-teal-300 bg-teal-50"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl border",
                      isActive ? "border-teal-200 bg-teal-100 text-teal-700" : "border-slate-200 bg-slate-50 text-slate-600",
                    ].join(" ")}
                  >
                    {c.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 truncate">{c.label}</p>
                      {isActive && (
                        <span className="shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{c.helperText}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-50 px-3 py-2">
              <p className="text-xs font-semibold text-teal-700">{selectedMeta.label}</p>
            </div>
            <div className="text-sm text-slate-500">
              Page <span className="font-medium text-slate-700">{page}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[260px]">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${selectedMeta.label}...`}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">Rows per page</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const next = Number(e.target.value) as 10 | 20 | 50 | 100;
                  setPageSize(next);
                  setSkip(0);
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                disabled={loading}
              >
                {ITEM_ROWS_PAGE_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 sm:px-5 py-3 text-slate-500 font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-slate-500 font-medium">
                    {selectedMeta.detailKind === "none"
                      ? "Details"
                      : selectedMeta.detailKind === "category"
                        ? "Category"
                        : selectedMeta.detailKind === "code"
                          ? "Code"
                          : selectedMeta.detailKind === "type"
                            ? "Type"
                            : "Details"}
                  </th>
                  <th className="text-right px-4 sm:px-5 py-3 text-slate-500 font-medium">ID</th>
                  <th className="text-right px-4 sm:px-5 py-3 text-slate-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {error ? (
                  <tr>
                    <td colSpan={4} className="py-10 px-4 text-sm text-red-700">
                      {error}
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-400">
                      No results found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((it) => {
                    const name = "name" in it ? String(it.name) : "";
                    const detailsText = getItemDetailText(it, selectedMeta.detailKind);
                    return (
                      <tr key={it.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-4 sm:px-5 py-4">
                          <p className="font-medium text-slate-900 truncate max-w-[260px]">{name}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600 truncate max-w-[260px]">
                          {detailsText ?? "—"}
                        </td>
                        <td className="px-4 sm:px-5 py-4 text-right text-slate-500 font-mono text-xs">
                          {it.id.slice(0, 10)}…
                        </td>
                        <td className="px-4 sm:px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled
                              className="h-8 px-3 rounded-lg border border-slate-200 text-slate-400 text-xs font-medium bg-white cursor-not-allowed"
                              aria-disabled="true"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled
                              className="h-8 px-3 rounded-lg border border-slate-200 text-slate-400 text-xs font-medium bg-white cursor-not-allowed"
                              aria-disabled="true"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-t border-slate-100 bg-white">
          <div className="text-sm text-slate-500 whitespace-nowrap">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredItems.length === 0 ? 0 : skip + 1}
            </span>
            -
            <span className="font-medium text-slate-700">
              {filteredItems.length === 0 ? 0 : skip + filteredItems.length}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <button
              onClick={() => {
                const prevSkip = Math.max(0, skip - pageSize);
                setSkip(prevSkip);
              }}
              disabled={skip === 0 || loading}
              className="h-9 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={() => {
                if (!hasNext) return;
                setSkip(skip + pageSize);
              }}
              disabled={!hasNext || loading}
              className="h-9 px-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

