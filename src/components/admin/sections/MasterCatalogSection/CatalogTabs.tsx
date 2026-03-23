"use client";

import type { TopTabId } from "./_lib/types";
import { TOP_TABS } from "./_lib/constants";

interface CatalogTabsProps {
  activeTab: TopTabId;
  onTabChange: (tabId: TopTabId) => void;
}

export function CatalogTabs({ activeTab, onTabChange }: CatalogTabsProps) {
  return (
    <nav className="flex flex-wrap gap-1 px-2" aria-label="Catalog areas">
      {TOP_TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={[
              "relative px-4 py-3 text-sm font-semibold transition-colors",
              isActive ? "text-teal-700" : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            {tab.title}
            {isActive ? (
              <span
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-teal-600"
                aria-hidden
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
