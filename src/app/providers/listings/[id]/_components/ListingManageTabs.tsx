"use client";

import type { ListingTabItem, TabId } from "./listingManage.types";

interface ListingManageTabsProps {
  tabs: ListingTabItem[];
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function ListingManageTabs({
  tabs,
  activeTab,
  onChange,
}: ListingManageTabsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {tabs.map(({ id, label, description, count }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`rounded-xl border p-3 text-left transition-colors ${
            activeTab === id
              ? "border-teal-600 bg-teal-50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className={`text-sm font-semibold ${
                activeTab === id ? "text-teal-700" : "text-slate-800"
              }`}
            >
              {label}
            </span>
            {count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activeTab === id ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {count}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </button>
      ))}
    </div>
  );
}
