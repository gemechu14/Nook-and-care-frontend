"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import { BASE_URL } from "@/constants/config";
import type { ApiListing, ApiListingImage, ApiCareType } from "@/types";
import { CARE_TYPE_LABELS, CARE_TYPE_COLORS } from "@/types";
import { Badge } from "@/components/admin/shared/Badge";

export default function AdminListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [listing, setListing] = useState<any>(null);
  const [images, setImages] = useState<ApiListingImage[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setPageError("Invalid listing ID.");
      setPageLoading(false);
      return;
    }

    const loadListing = async () => {
      try {
        const [data, imgs] = await Promise.all([
          listingsApi.getById(id),
          listingImagesApi.getByListing(id).catch(() => [] as ApiListingImage[]),
        ]);
        setListing(data);
        setImages(imgs);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Listing not found.");
      } finally {
        setPageLoading(false);
      }
    };

    loadListing();
  }, [id]);

  const handleApprove = async () => {
    if (!listing || actionLoading) return;
    setActionLoading(true);
    try {
      const updated = await listingsApi.activate(listing.id);
      setListing(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve listing");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!listing || actionLoading) return;
    if (!confirm("Are you sure you want to reject this listing?")) return;
    setActionLoading(true);
    try {
      alert("Reject functionality needs to be implemented in the API");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject listing");
    } finally {
      setActionLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing || pageError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px]">
        <p className="text-xl font-semibold text-slate-700">Listing not found</p>
        <p className="text-slate-500">{pageError}</p>
        <Link 
          href="/admin?nav=listings" 
          className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  // Helper to construct image URL using image_url from list and base URL
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    // If image_url is already absolute, return as is
    if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
      return imageUrl;
    }
    
    // If image_url is relative (starts with /), prepend base URL (without /api/v1)
    if (imageUrl && imageUrl.startsWith("/")) {
      const baseUrl = BASE_URL.replace("/api/v1", "");
      return `${baseUrl}${imageUrl}`;
    }
    
    // Fallback to placeholder
    return "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80";
  };

  const listingImages = images.length > 0
    ? images.sort((a, b) => a.display_order - b.display_order).map((img) => ({
        url: getImageUrl(img.image_url),
        alt: `${listing.title} image`
      }))
    : [{ url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", alt: "Placeholder" }];

  const careTypeColor = CARE_TYPE_COLORS[listing.care_type as ApiCareType] ?? "teal";
  const badgeColorClass = careTypeColor === "teal" ? "bg-teal-50 text-teal-700 border-teal-200" :
    careTypeColor === "purple" ? "bg-purple-50 text-purple-700 border-purple-200" :
    careTypeColor === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" :
    "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Badge status={listing.status} />
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-slate-600">
              <span>Created At: {new Date(listing.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {listing.status === "PENDING" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {actionLoading ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
          {/* Images */}
          {listingImages.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 min-h-[300px]">
                <div className="h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listingImages[0].url}
                    alt={listingImages[0].alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                {listingImages.length > 1 && (
                  <div className="grid grid-rows-2 gap-2">
                    {listingImages.slice(1, 3).map((img, i) => (
                      <div key={i} className="h-[145px] sm:h-[195px] rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${badgeColorClass}`}>
                    {CARE_TYPE_LABELS[listing.care_type as ApiCareType] ?? listing.care_type}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 break-words">{listing.title}</h1>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm break-words">
                    {[listing.address, listing.city, listing.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {listing.description && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Description</h2>
                <p className="text-slate-700 leading-relaxed">{listing.description}</p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Listing Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Price</p>
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  {listing.price ? `$${listing.price.toLocaleString()}` : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Capacity</p>
                <p className="text-base sm:text-lg font-bold text-slate-900">{listing.capacity ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Available Beds</p>
                <p className="text-base sm:text-lg font-bold text-teal-600">{listing.available_beds ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              {listing.phone && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-slate-700 break-all">{listing.phone}</span>
                </div>
              )}
              {listing.email && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-700 break-all">{listing.email}</span>
                </div>
              )}
              {listing.license_number && (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-slate-700">License: {listing.license_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.has_24_hour_care && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-sm">24-hour care</span>
                </div>
              )}
              {listing.is_featured && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700 text-sm">Featured listing</span>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Amenities ({listing.amenities.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.amenity?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {listing.activities && listing.activities.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Activities ({listing.activities.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.activities.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.activity?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {listing.languages && listing.languages.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Languages ({listing.languages.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.languages.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.language?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {listing.certifications && listing.certifications.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Certifications ({listing.certifications.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.certifications.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.certification?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dining Options */}
          {listing.dining_options && listing.dining_options.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Dining Options ({listing.dining_options.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.dining_options.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.dining_option?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Features */}
          {listing.safety_features && listing.safety_features.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Safety Features ({listing.safety_features.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.safety_features.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.safety_feature?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Options */}
          {listing.insurance_options && listing.insurance_options.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Insurance Options ({listing.insurance_options.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.insurance_options.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.insurance_option?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* House Rules */}
          {listing.house_rules && listing.house_rules.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">House Rules ({listing.house_rules.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.house_rules.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.house_rule?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {listing.equipment && listing.equipment.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Equipment ({listing.equipment.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.equipment.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.equipment?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {listing.services && listing.services.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Treatment Services ({listing.services.length})</h2>
              <div className="flex flex-wrap gap-2">
                {listing.services.map((item: any) => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700">
                    {item.treatment_service?.name || 'Unknown'}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
