"use client";

import type { CatalogKey } from "./_lib/types";
import type { CatalogMeta } from "./_lib/types";

interface CatalogSidebarProps {
  catalogKeys: readonly CatalogKey[];
  selectedKey: CatalogKey;
  metaByKey: Record<CatalogKey, CatalogMeta>;
  onSelect: (key: CatalogKey) => void;
}

export function CatalogSidebar({
  catalogKeys,
  selectedKey,
  metaByKey,
  onSelect,
}: CatalogSidebarProps) {
  return (
    <aside className="shrink-0 border-b border-slate-200 bg-slate-50 md:w-56 md:border-b-0 md:border-r">
      <p className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Sub-categories
      </p>
      <nav className="flex flex-row gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible md:px-2 md:pb-4">
        {catalogKeys.map((key) => {
          const meta = metaByKey[key];
          const isActive = key === selectedKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={[
                "flex min-w-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-white hover:shadow-sm",
              ].join(" ")}
            >
              <span className={isActive ? "text-white" : "text-slate-500"}>{meta.icon}</span>
              <span className="truncate">{meta.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
