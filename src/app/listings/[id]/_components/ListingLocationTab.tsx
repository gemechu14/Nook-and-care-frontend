"use client";

import type { ListingDetail } from "../_types";

interface ListingLocationTabProps {
  listing: ListingDetail;
}

export function ListingLocationTab({ listing }: ListingLocationTabProps) {
  const hasCoords =
    typeof listing.latitude === "number" && typeof listing.longitude === "number";
  const mapsQuery = hasCoords
    ? `${listing.latitude},${listing.longitude}`
    : encodeURIComponent(listing.address);
  const embedSrc = hasCoords
    ? `https://www.google.com/maps?q=${encodeURIComponent(`${listing.latitude},${listing.longitude}`)}&z=12&output=embed`
    : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-2">Location</h3>
      <p className="text-slate-600 text-sm mb-4">{listing.address}</p>

      <div className="h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
        {embedSrc ? (
          <iframe
            title="Map"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={embedSrc}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-6 text-center">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-slate-500 text-sm">Map preview isn&apos;t available for this listing yet.</p>
            <a
              className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {hasCoords
            ? `Coordinates: ${listing.latitude!.toFixed(5)}, ${listing.longitude!.toFixed(5)}`
            : "Coordinates not provided"}
        </p>
        <a
          className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
