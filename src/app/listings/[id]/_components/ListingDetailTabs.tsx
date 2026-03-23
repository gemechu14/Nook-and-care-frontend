"use client";

import type { DetailTabId, ListingDetail } from "../_types";
import { ListingLocationTab } from "./ListingLocationTab";
import { ListingReviewsTab } from "./ListingReviewsTab";
import { ListingServicesTab } from "./ListingServicesTab";

const TABS: { id: DetailTabId; label: string }[] = [
  { id: "services", label: "Services & Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
];

interface ListingDetailTabsProps {
  listing: ListingDetail;
  isMockListing: boolean;
  activeTab: DetailTabId;
  onTabChange: (tab: DetailTabId) => void;
}

export function ListingDetailTabs({
  listing,
  isMockListing,
  activeTab,
  onTabChange,
}: ListingDetailTabsProps) {
  return (
    <>
      <div className="border-b border-slate-200 mb-4 sm:mb-6 overflow-x-auto">
        <div className="flex gap-4 sm:gap-6 md:gap-8 min-w-max sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 sm:pb-4 px-1 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "services" && <ListingServicesTab listing={listing} />}

      {activeTab === "reviews" && (
        <ListingReviewsTab
          listingId={listing.id}
          isMockListing={isMockListing}
        />
      )}

      {activeTab === "location" && <ListingLocationTab listing={listing} />}
    </>
  );
}
