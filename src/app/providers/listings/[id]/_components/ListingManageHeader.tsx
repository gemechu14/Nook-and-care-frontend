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

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white/85 p-3">
          <p className="text-xs font-medium text-slate-500">Monthly price</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {listing.price ? `$${listing.price.toLocaleString()}` : "Not set"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/85 p-3">
          <p className="text-xs font-medium text-slate-500">Capacity</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {listing.capacity ?? "Not set"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white/85 p-3">
          <p className="text-xs font-medium text-slate-500">Uploaded images</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{imageCount}</p>
        </div>
      </div>
    </section>
  );
}
