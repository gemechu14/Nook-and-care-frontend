"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import { Badge } from "@/components/admin/shared/Badge";
import { BASE_URL } from "@/constants/config";
import { CARE_TYPE_LABELS } from "@/types";
import type { ApiListing, ApiListingImage } from "@/types";

export default function AdminListingReadOnlyPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<"details" | "images" | "location" | "features">("details");
  const [listing, setListing] = useState<ApiListing | null>(null);
  const [images, setImages] = useState<ApiListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [listingData, listingImages] = await Promise.all([
          listingsApi.getById(id),
          listingImagesApi.getByListing(id).catch(() => []),
        ]);
        if (!mounted) return;
        setListing(listingData);
        setImages(
          listingData.images && listingData.images.length > 0
            ? listingData.images
            : listingImages
        );
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load listing details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (id) void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-600">{error ?? "Listing not found."}</p>
        <Link href="/admin?nav=listings" className="mt-4 inline-block text-sm font-medium text-teal-600 hover:text-teal-700">
          Back to listings
        </Link>
      </div>
    );
  }

  const coverImage = images.find((i) => i.is_primary) ?? images[0] ?? null;
  const coverImageUrl = coverImage ? toAbsoluteImageUrl(coverImage) : "";

  return (
    <div className="space-y-6">
      <Link href="/admin?nav=listings" className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700">
        <span aria-hidden>←</span> Back to listings
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Listing Details</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{listing.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {CARE_TYPE_LABELS[listing.care_type]} · {[listing.city, listing.state].filter(Boolean).join(", ") || "Location pending"}
          </p>
        </div>
        <Badge status={listing.status} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Listing Overview
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Listing Information
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <WorkspaceTab
              title="Details"
              subtitle="Core listing content and contact data"
              active={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
            <WorkspaceTab
              title="Images"
              count={images.length}
              subtitle="Upload and arrange gallery photos"
              active={activeTab === "images"}
              onClick={() => setActiveTab("images")}
            />
            <WorkspaceTab
              title="Location"
              subtitle="Latitude and longitude for maps"
              active={activeTab === "location"}
              onClick={() => setActiveTab("location")}
            />
            <WorkspaceTab
              title="Features"
              count={
                (listing.amenities?.length ?? 0) +
                (listing.activities?.length ?? 0) +
                (listing.languages?.length ?? 0) +
                (listing.certifications?.length ?? 0) +
                (listing.dining_options?.length ?? 0) +
                (listing.safety_features?.length ?? 0) +
                (listing.insurance_options?.length ?? 0) +
                (listing.house_rules?.length ?? 0) +
                (listing.equipment?.length ?? 0) +
                (listing.services?.length ?? 0)
              }
              subtitle="Amenities, services, safety and policies"
              active={activeTab === "features"}
              onClick={() => setActiveTab("features")}
            />
          </div>
        </div>
      </section>

      {activeTab === "details" && (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Basic Information</h2>
              <p className="mt-1 text-xs text-slate-500">Core</p>
              <div className="mt-4 space-y-3 text-sm">
                <FactRow label="Title" value={listing.title} />
                <FactRow label="Care Type" value={CARE_TYPE_LABELS[listing.care_type] ?? listing.care_type} />
                <FactRow label="Price ($/month)" value={listing.price ? String(listing.price) : "—"} />
                <FactRow label="Capacity" value={listing.capacity ? String(listing.capacity) : "—"} />
                <FactRow label="Description" value={listing.description?.trim() || "No description provided yet."} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">Operations</h2>
              <p className="mt-1 text-xs text-slate-500">Internal</p>
              <div className="mt-4 space-y-3 text-sm">
                <FactRow label="Room Type" value={listing.room_type || "—"} />
                <FactRow label="Currency" value={listing.currency || "—"} />
                <FactRow label="License Number" value={listing.license_number || "—"} />
                <FactRow label="Available Beds" value={listing.available_beds ? String(listing.available_beds) : "—"} />
                <FactRow label="Staff Ratio" value={listing.staff_ratio || "—"} />
                <FactRow label="24-hour care available" value={listing.has_24_hour_care ? "Yes" : "No"} />
                <FactRow label="Featured" value={listing.is_featured ? "Yes" : "No"} />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Location & Contact</h2>
            <p className="mt-1 text-xs text-slate-500">Public</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
              <FactRow label="Address" value={listing.address || "—"} />
              <FactRow label="Postal Code" value={listing.postal_code || "—"} />
              <FactRow label="Phone" value={listing.phone || "—"} />
              <FactRow label="Email" value={listing.email || "—"} />
              <FactRow label="City" value={listing.city || "—"} />
              <FactRow label="State" value={listing.state || "—"} />
              <FactRow label="Country" value={listing.country || "—"} />
              <FactRow label="Established Year" value={listing.established_year ? String(listing.established_year) : "—"} />
            </div>
          </section>
        </>
      )}

      {activeTab === "images" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Uploaded Images ({images.length})</h2>
          {images.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No images available.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => {
                const imageSrc = toAbsoluteImageUrl(image);
                return (
                  <div key={image.id} className="rounded-xl border border-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageSrc} alt="Listing image" className="h-40 w-full object-cover" />
                    <div className="px-3 py-2 text-xs text-slate-500">
                      <p>Order: {image.display_order}</p>
                      <p>{image.is_primary ? "Primary image" : "Secondary image"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeTab === "location" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Google Maps (Optional)</h2>
          <p className="mt-2 text-sm text-slate-500">
            Open Google Maps, pick a point, then paste the share link to auto-fill coordinates.
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-sm font-medium text-slate-700">Coordinates</p>
            <p className="mt-1 text-sm text-slate-500">
              Set latitude and longitude for map display. Use decimal degrees (e.g. 47.6062, -122.3321).
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <FactRow
                label="Latitude"
                value={listing.latitude !== null && listing.latitude !== undefined ? String(listing.latitude) : "—"}
              />
              <FactRow
                label="Longitude"
                value={listing.longitude !== null && listing.longitude !== undefined ? String(listing.longitude) : "—"}
              />
            </div>
          </div>
        </section>
      )}

      {activeTab === "features" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Features & Services</h2>
          <div className="mt-4 space-y-6">
            <TagGroup
              title="Amenities"
              items={(listing.amenities ?? []).map((item) => item.amenity?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Languages"
              items={(listing.languages ?? []).map((item) => item.language?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Certifications"
              items={(listing.certifications ?? []).map((item) => item.certification?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Activities"
              items={(listing.activities ?? []).map((item) => item.activity?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Dining Options"
              items={(listing.dining_options ?? []).map((item) => item.dining_option?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Safety Features"
              items={(listing.safety_features ?? []).map((item) => item.safety_feature?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Insurance Options"
              items={(listing.insurance_options ?? []).map((item) => item.insurance_option?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="House Rules"
              items={(listing.house_rules ?? []).map((item) => item.house_rule?.name).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Equipment"
              items={(listing.equipment ?? []).map((item) => `${item.equipment?.name}${item.quantity ? ` (x${item.quantity})` : ""}`).filter(Boolean) as string[]}
            />
            <TagGroup
              title="Treatment Services"
              items={(listing.services ?? [])
                .map((item) => `${item.treatment_service?.name}${item.price !== null && item.price !== undefined ? ` - $${item.price}` : ""}`)
                .filter(Boolean) as string[]}
            />
          </div>
        </section>
      )}
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}

function WorkspaceTab({
  title,
  subtitle,
  count,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-3 text-left transition-colors",
        active
          ? "border-teal-300 bg-teal-50/60"
          : "border-slate-200 bg-slate-50/50 hover:border-teal-200 hover:bg-teal-50/30",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {typeof count === "number" ? (
          <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {count}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </button>
  );
}

function TagGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-800">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No data.</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span key={`${title}-${idx}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function toAbsoluteImageUrl(image: ApiListingImage): string {
  if (image.image_url) {
    if (image.image_url.startsWith("http://") || image.image_url.startsWith("https://")) {
      return image.image_url;
    }
    if (image.image_url.startsWith("/")) {
      const baseUrl = BASE_URL.replace("/api/v1", "");
      return `${baseUrl}${image.image_url}`;
    }
  }
  return listingImagesApi.getDownloadUrl(image.id);
}
