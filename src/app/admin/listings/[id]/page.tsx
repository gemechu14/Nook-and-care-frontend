"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import { useAuth } from "@/store/authStore";
import type { ApiListing, ApiListingImage } from "@/types";
import { CARE_TYPE_LABELS, CARE_TYPE_COLORS } from "@/types";

const NAV = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { id: "providers", label: "Providers", href: "/admin?nav=providers", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )},
  { id: "listings", label: "Listings", href: "/admin?nav=listings", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )},
  { id: "tours", label: "Tours", href: "/admin?nav=tours", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { id: "reports", label: "Reports", href: "/admin?nav=reports", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )},
] as const;

function Badge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    INACTIVE: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default function AdminListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  
  const [listing, setListing] = useState<ApiListing | null>(null);
  const [images, setImages] = useState<ApiListingImage[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    if (avatarMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [avatarMenuOpen]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "ADMIN") {
      router.push("/admin");
      return;
    }
  }, [user, authLoading, router]);

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
      // Assuming there's a reject/update endpoint - adjust based on your API
      // For now, we'll just show an alert
      alert("Reject functionality needs to be implemented in the API");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject listing");
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex min-h-screen bg-[#f0f2f5]">
        <aside className="w-56 shrink-0 bg-[#1a2035] text-white flex flex-col fixed inset-y-0 z-30">
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-sm">N</div>
            <span className="font-bold text-base">Nook Admin</span>
          </div>
        </aside>
        <div className="flex-1 ml-56 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!listing || pageError) {
    return (
      <div className="flex min-h-screen bg-[#f0f2f5]">
        <aside className="w-56 shrink-0 bg-[#1a2035] text-white flex flex-col fixed inset-y-0 z-30">
          <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-sm">N</div>
            <span className="font-bold text-base">Nook Admin</span>
          </div>
        </aside>
        <div className="flex-1 ml-56 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-xl font-semibold text-slate-700">Listing not found</p>
          <p className="text-slate-500">{pageError}</p>
          <Link href="/admin" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const listingImages = images.length > 0
    ? images.sort((a, b) => a.display_order - b.display_order).map((img) =>
        img.image_url ?? listingImagesApi.getDownloadUrl(img.id)
      )
    : ["https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"];

  const careTypeColor = CARE_TYPE_COLORS[listing.care_type] ?? "teal";
  const badgeColorClass = careTypeColor === "teal" ? "bg-teal-50 text-teal-700 border-teal-200" :
    careTypeColor === "purple" ? "bg-purple-50 text-purple-700 border-purple-200" :
    careTypeColor === "blue" ? "bg-blue-50 text-blue-700 border-blue-200" :
    "bg-orange-50 text-orange-700 border-orange-200";

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* ─── Sidebar ─── */}
      <aside className="w-56 shrink-0 bg-[#1a2035] text-white flex flex-col fixed inset-y-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-sm">N</div>
          <span className="font-bold text-base">Nook Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest px-3 mb-3">Menu</p>
          <ul className="space-y-0.5">
            {NAV.map(({ id, label, href, icon }) => (
              <li key={id}>
                <Link
                  href={href}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    id === "listings"
                      ? "bg-teal-500/20 text-teal-400"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {icon} {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div ref={avatarMenuRef} className="px-4 py-4 border-t border-white/10 relative">
          <button
            onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
            className="w-full flex items-center gap-2.5 hover:bg-white/5 rounded-lg p-2 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-400">
              {user?.full_name?.[0] ?? "A"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{user?.full_name ?? "Admin"}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
            <svg className={`w-4 h-4 text-white/40 transition-transform ${avatarMenuOpen ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {avatarMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              <button
                onClick={() => {
                  setAvatarMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <div className="border-t border-slate-100 mt-1">
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 ml-56">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-semibold text-slate-900">Nook and Care Platform</span>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-7xl mx-auto">
              {/* Action Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge status={listing.status} />
                <span className="text-sm text-slate-600">
                  Created: {new Date(listing.created_at).toLocaleDateString()}
                </span>
                {listing.updated_at !== listing.created_at && (
                  <span className="text-sm text-slate-600">
                    Updated: {new Date(listing.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {listing.status === "PENDING" && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </>
                )}
                <Link
                  href={`/listings/${listing.id}`}
                  target="_blank"
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  View Public Page
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Images */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-2 gap-2 p-2" style={{ height: "400px" }}>
                    <div className="relative">
                      <Image
                        src={listingImages[0] ?? listingImages[0]}
                        alt={listing.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-2">
                      {listingImages.slice(1, 3).map((img, i) => (
                        <div key={i} className="relative">
                          <Image
                            src={img}
                            alt={`${listing.title} ${i + 2}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${badgeColorClass}`}>
                          {CARE_TYPE_LABELS[listing.care_type] ?? listing.care_type}
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">
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
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Listing Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Price</p>
                      <p className="text-lg font-bold text-slate-900">
                        {listing.price ? `$${listing.price.toLocaleString()}` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Capacity</p>
                      <p className="text-lg font-bold text-slate-900">{listing.capacity ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Available Beds</p>
                      <p className="text-lg font-bold text-teal-600">{listing.available_beds ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Room Type</p>
                      <p className="text-sm font-medium text-slate-700">{listing.room_type ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Staff Ratio</p>
                      <p className="text-sm font-medium text-slate-700">{listing.staff_ratio ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Established</p>
                      <p className="text-sm font-medium text-slate-700">{listing.established_year ?? "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    {listing.phone && (
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-slate-700">{listing.phone}</span>
                      </div>
                    )}
                    {listing.email && (
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-slate-700">{listing.email}</span>
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
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Features</h2>
                  <div className="grid grid-cols-2 gap-3">
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
              </div>

              {/* Right Column - Metadata */}
              <div className="space-y-6">
                {/* System Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">System Information</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Listing ID</p>
                      <p className="font-mono text-xs text-slate-700 break-all">{listing.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Provider ID</p>
                      <p className="font-mono text-xs text-slate-700 break-all">{listing.provider_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Status</p>
                      <Badge status={listing.status} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Created At</p>
                      <p className="text-slate-700">{new Date(listing.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Updated At</p>
                      <p className="text-slate-700">{new Date(listing.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Location Data */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Location Data</h2>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">Address: </span>
                      <span className="text-slate-700">{listing.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">City: </span>
                      <span className="text-slate-700">{listing.city}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">State: </span>
                      <span className="text-slate-700">{listing.state}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Country: </span>
                      <span className="text-slate-700">{listing.country}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Postal Code: </span>
                      <span className="text-slate-700">{listing.postal_code}</span>
                    </div>
                    {listing.latitude && listing.longitude && (
                      <div>
                        <span className="text-slate-500">Coordinates: </span>
                        <span className="text-slate-700 font-mono text-xs">
                          {listing.latitude}, {listing.longitude}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

