import { StarRating } from "@/components/ui/StarRating";
import { BADGE_COLORS } from "../_constants";
import type { ListingDetail } from "../_types";

interface ListingIdentitySectionProps {
  listing: ListingDetail;
}

export function ListingIdentitySection({ listing }: ListingIdentitySectionProps) {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-3">
        {listing.careTypes.map((type, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${BADGE_COLORS[type.color] ?? BADGE_COLORS.teal}`}
          >
            {type.color === "teal" && (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            {type.color === "purple" && (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                />
              </svg>
            )}
            {type.label}
          </span>
        ))}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        {listing.title}
      </h1>

      <div className="flex items-center gap-1.5 text-slate-500 mb-3">
        <svg
          className="w-4 h-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm">{listing.address}</span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <StarRating rating={listing.rating} size="lg" />
        <span className="font-semibold text-slate-900">
          {listing.rating.toFixed(1)}
        </span>
        <span className="text-slate-500 text-sm">
          ({listing.reviewCount} reviews)
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Starting at
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            ${listing.price.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">per month</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Capacity
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            {listing.capacity}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">residents</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Available
          </p>
          <p className="text-xl sm:text-2xl font-bold text-teal-600">
            {listing.bedsAvailable}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">beds</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Staff Ratio
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">
            {listing.staffRatio}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">nurse:resident</p>
        </div>
      </div>
    </>
  );
}
