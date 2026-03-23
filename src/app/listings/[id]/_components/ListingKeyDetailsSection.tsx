import type { ListingDetail } from "../_types";

interface ListingKeyDetailsSectionProps {
  listing: ListingDetail;
}

export function ListingKeyDetailsSection({
  listing,
}: ListingKeyDetailsSectionProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
        Key Details
      </h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-teal-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-slate-700">24-hour care available</span>
        </div>
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-teal-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-slate-700">
            Established {listing.established}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-teal-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-slate-700">{listing.capacity} bed community</span>
        </div>
      </div>
    </div>
  );
}
