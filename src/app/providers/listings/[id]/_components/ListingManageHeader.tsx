"use client";

import Link from "next/link";
import { CARE_TYPE_LABELS, type ApiListing } from "@/types";

interface ListingManageHeaderProps {
  listing: ApiListing;
  imageCount: number;
  onBackHref?: string;
}

export function ListingManageHeader({
  listing,
  imageCount,
  onBackHref = "/providers/dashboard?nav=listings",
}: ListingManageHeaderProps) {
  const location = [listing.city, listing.state].filter(Boolean).join(", ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-teal-50/70 p-6 shadow-sm">
      <div className="mb-4">
        <Link
          href={onBackHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          <span aria-hidden>←</span>
          Back to listings
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {listing.title}
          </h1>
          <p className="text-sm text-slate-600">
            {CARE_TYPE_LABELS[listing.care_type]}
            {location ? ` · ${location}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              listing.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : listing.status === "PENDING"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
            }`}
          >
            {listing.status}
          </span>
        </div>
      </div>

      {/* Stats cards intentionally hidden to reduce vertical scroll. */}
    </section>
  );
}
