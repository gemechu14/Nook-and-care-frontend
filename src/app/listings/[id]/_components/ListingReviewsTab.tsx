"use client";

import { ListingReviews } from "@/components/ui/ListingReviews";

interface ListingReviewsTabProps {
  listingId: string;
  isMockListing: boolean;
}

export function ListingReviewsTab({
  listingId,
  isMockListing,
}: ListingReviewsTabProps) {
  if (isMockListing) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-12 h-12 text-slate-300 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p className="text-slate-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return <ListingReviews listingId={listingId} pageSize={20} />;
}
