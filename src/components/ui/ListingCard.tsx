"use client";

import Link from "next/link";
import Image from "next/image";
import type { ApiListing } from "@/types";
import { CARE_TYPE_LABELS } from "@/types";

interface CareTypeBadge {
  label: string;
  color: "teal" | "purple" | "blue" | "orange" | "slate";
}

interface ListingCardProps {
  listing: ApiListing | {
    id: string;
    title: string;
    location?: string;
    careTypes?: CareTypeBadge[];
    care_type?: string;
    price?: number;
    rating?: number;
    reviewCount?: number;
    bedsAvailable?: number;
    available_beds?: number;
    image?: string;
    image_url?: string;
    verified?: boolean;
  };
}

const badgeColors: Record<string, string> = {
  teal: "bg-teal-50 text-teal-700 border-teal-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  slate: "bg-slate-50 text-slate-700 border-slate-200",
};

const careTypeColorMap: Record<string, "teal" | "purple" | "blue" | "orange" | "slate"> = {
  ASSISTED_LIVING: "teal",
  MEMORY_CARE: "purple",
  INDEPENDENT_LIVING: "blue",
  ADULT_FAMILY_HOME: "orange",
  SKILLED_NURSING: "slate",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.floor(rating) ? "text-amber-400" : star - 0.5 <= rating ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Handle API format vs legacy format
  const isApiListing = "care_type" in listing;
  
  // Extract care types
  const careTypes: CareTypeBadge[] = isApiListing && listing.care_type
    ? [{
        label: CARE_TYPE_LABELS[listing.care_type as keyof typeof CARE_TYPE_LABELS] || listing.care_type,
        color: careTypeColorMap[listing.care_type as keyof typeof careTypeColorMap] || "teal",
      }]
    : ("careTypes" in listing && listing.careTypes) || [];
  
  // Extract other fields
  // Prefer explicit image props passed from callers (homepage/search) and fall back gracefully
  const image =
    ("image" in listing && listing.image) ||
    ("image_url" in listing && listing.image_url) ||
    // Some callers may attach a computed primary image URL
    ("primaryImageUrl" in (listing as any) && (listing as any).primaryImageUrl) ||
    // Final fallback placeholder (remote image to avoid missing local asset issues)
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80";
  const location = isApiListing 
    ? [(listing as ApiListing).city, (listing as ApiListing).state].filter(Boolean).join(", ") || "Location TBD"
    : ("location" in listing ? listing.location : "Location TBD") || "Location TBD";
  const bedsAvailable = isApiListing 
    ? ((listing as ApiListing).available_beds ?? 0)
    : ("bedsAvailable" in listing ? listing.bedsAvailable : 0) ?? 0;
  const price = ("price" in listing ? listing.price : 0) ?? 0;
  const rating = isApiListing
    ? ((listing as ApiListing).avg_rating ?? 0)
    : ("rating" in listing ? listing.rating : 0) ?? 0;
  const reviewCount = isApiListing
    ? ((listing as ApiListing).review_count ?? 0)
    : ("reviewCount" in listing ? listing.reviewCount : 0) ?? 0;
  const verified = isApiListing
    ? ((listing as ApiListing).status === "ACTIVE")
    : ("verified" in listing ? listing.verified : false) ?? false;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={listing.title}
          unoptimized
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Beds badge */}
        {bedsAvailable > 0 && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 bg-teal-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v3H4V7zM2 11h16v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
              </svg>
              {bedsAvailable} beds available
            </span>
          </div>
        )}
        {/* Favorite */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Care type badges */}
        {careTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {careTypes.map((type, index) => (
              <span
                key={index}
                className={`text-xs font-medium px-2 py-1 rounded-full border ${badgeColors[type.color] ?? badgeColors.teal}`}
              >
                {type.label}
              </span>
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="font-semibold text-slate-900 text-lg mb-1">{listing.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{location}</span>
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={rating} />
            <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
            {reviewCount > 0 && (
              <span className="text-sm text-slate-500">({reviewCount} reviews)</span>
            )}
          </div>
        )}

        {/* Price + Actions */}
          <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Starting At</p>
            <p className="text-2xl font-bold text-slate-900">
              ${price.toLocaleString()}
              <span className="text-sm font-normal text-slate-500">/mo</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <Link
              href={`/listings/${listing.id}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-teal-600 text-white text-xs font-semibold tracking-wide hover:bg-teal-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Verified */}
        {verified && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 text-teal-600 text-xs font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Licensed &amp; Verified
          </div>
        )}
      </div>
    </div>
  );
}
