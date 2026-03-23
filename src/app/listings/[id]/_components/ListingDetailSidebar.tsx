"use client";

import { useRouter } from "next/navigation";
import type { ListingDetail } from "../_types";

interface ListingDetailSidebarProps {
  listing: ListingDetail;
  listingId: string;
  isAuthenticated: boolean;
  onScheduleTour: () => void;
  onRequestInfo: () => void;
}

export function ListingDetailSidebar({
  listing,
  listingId,
  isAuthenticated,
  onScheduleTour,
  onRequestInfo,
}: ListingDetailSidebarProps) {
  const router = useRouter();

  const handleAuthRequired = (action: () => void) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listingId}`)}`);
      return;
    }
    action();
  };

  return (
    <aside className="w-full lg:w-[416px] shrink-0 self-start lg:sticky lg:top-24">
      {/* Pricing Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 mb-4">
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-1">Monthly pricing from</p>
        <p className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
          ${listing.price.toLocaleString()}
        </p>
        <p className="text-xs sm:text-sm text-slate-500 text-center mb-4 sm:mb-6">
          up to ${listing.maxPrice.toLocaleString()}/mo
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleAuthRequired(onScheduleTour)}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Tour
          </button>
          <button
            type="button"
            onClick={() => handleAuthRequired(onRequestInfo)}
            className="w-full border border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Request Information
          </button>
          <a
            href={`tel:${listing.phone}`}
            className="w-full border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {listing.phone}
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-4">
        <div className="flex items-center justify-around">
          <button type="button" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-medium">Save</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-xs font-medium">Print</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
