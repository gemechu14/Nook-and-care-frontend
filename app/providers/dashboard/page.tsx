"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { listingsApi } from "@/lib/api/listings";
import { providersApi } from "@/lib/api/providers";
import { listingImagesApi } from "@/lib/api/listingImages";
import type { ApiListing, ApiProvider, ApiListingImage } from "@/types";
import { CARE_TYPE_LABELS } from "@/types";
import type { CreateListingRequest } from "@/types";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    INACTIVE: "bg-slate-100 text-slate-600",
    VERIFIED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

// ─── New Listing Modal ────────────────────────────────────────────────────────

const CARE_TYPES = [
  { value: "ASSISTED_LIVING", label: "Assisted Living" },
  { value: "MEMORY_CARE", label: "Memory Care" },
  { value: "INDEPENDENT_LIVING", label: "Independent Living" },
  { value: "ADULT_FAMILY_HOME", label: "Adult Family Home" },
  { value: "SKILLED_NURSING", label: "Skilled Nursing" },
] as const;

function NewListingModal({ onClose, onCreated }: { onClose: () => void; onCreated: (l: ApiListing) => void }) {
  const [form, setForm] = useState<Partial<CreateListingRequest>>({ care_type: "ASSISTED_LIVING" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const listing = await listingsApi.create(form as CreateListingRequest);
      onCreated(listing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing.");
    } finally {
      setSaving(false);
    }
  };

  const f = (key: keyof CreateListingRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Create New Listing</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Facility Title *</label>
              <input required value={form.title ?? ""} onChange={f("title")} placeholder="e.g. Sunrise Senior Living"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Care Type *</label>
              <select value={form.care_type} onChange={f("care_type")}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white">
                {CARE_TYPES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Monthly Price ($)</label>
              <input type="number" value={form.price ?? ""} onChange={f("price")} placeholder="3500"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input value={form.city ?? ""} onChange={f("city")} placeholder="Seattle"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
              <input value={form.state ?? ""} onChange={f("state")} placeholder="WA"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input value={form.address ?? ""} onChange={f("address")} placeholder="123 Main St"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input value={form.phone ?? ""} onChange={f("phone")} placeholder="(425) 555-0100"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={form.email ?? ""} onChange={f("email")} placeholder="info@facility.com"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
              <input type="number" value={form.capacity ?? ""} onChange={f("capacity")} placeholder="20"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">License Number</label>
              <input value={form.license_number ?? ""} onChange={f("license_number")} placeholder="AL-0892341"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea value={form.description ?? ""} onChange={f("description")} rows={3} placeholder="Describe your facility..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:opacity-60">
              {saving ? "Creating…" : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Image Manager Modal ──────────────────────────────────────────────────────

function ImageManagerModal({ listing, onClose }: { listing: ApiListing; onClose: () => void }) {
  const [images, setImages] = useState<ApiListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    listingImagesApi.getByListing(listing.id)
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [listing.id]);

  const uploadFile = async (file: File, isPrimary = false) => {
    setUploading(true);
    setUploadError(null);
    try {
      const img = await listingImagesApi.upload(listing.id, file, images.length, isPrimary);
      setImages((prev) => [...prev, img]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f, i) => uploadFile(f, i === 0 && images.length === 0));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach((f, i) => uploadFile(f, i === 0 && images.length === 0));
  };

  const removeImage = async (imgId: string) => {
    await listingImagesApi.delete(imgId).catch(() => {});
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  };

  const setPrimary = async (imgId: string) => {
    await listingImagesApi.update(imgId, { is_primary: true }).catch(() => {});
    setImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === imgId })));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Images</h2>
            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{listing.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-colors ${
              dragOver ? "border-teal-400 bg-teal-50" : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {uploading ? "Uploading…" : "Drop images here or click to browse"}
              </p>
              <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WebP, GIF — max 10MB each</p>
            </div>
            <input
              type="file" multiple accept="image/*"
              onChange={handleFileInput} disabled={uploading}
              className="sr-only"
            />
          </label>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{uploadError}</div>
          )}

          {/* Images grid */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">No images yet. Upload some above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.sort((a, b) => a.display_order - b.display_order).map((img) => {
                const src = img.image_url ?? listingImagesApi.getDownloadUrl(img.id);
                return (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {img.is_primary && (
                      <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Primary</div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.is_primary && (
                        <button onClick={() => setPrimary(img.id)}
                          className="bg-white text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors">
                          Set Primary
                        </button>
                      )}
                      <button onClick={() => removeImage(img.id)}
                        className="bg-red-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pending Status Panel ─────────────────────────────────────────────────────

function PendingVerificationPanel({ provider }: { provider: ApiProvider | null }) {
  const steps = [
    { label: "Account Created", done: true },
    { label: "Provider Profile Submitted", done: !!provider },
    { label: "Admin Verification", done: provider?.verification_status === "VERIFIED", inProgress: provider?.verification_status === "PENDING" },
    { label: "List Your Facilities", done: false, locked: provider?.verification_status !== "VERIFIED" },
  ];

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Verification Pending</h2>
            <p className="text-sm text-slate-500">Your application is being reviewed by our team</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                step.done ? "bg-teal-600" :
                step.inProgress ? "bg-amber-500" :
                "bg-slate-200"
              }`}>
                {step.done ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.inProgress ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full ${step.locked ? "bg-slate-400" : "bg-slate-400"}`} />
                )}
              </div>
              <span className={`text-sm font-medium ${
                step.done ? "text-teal-700" :
                step.inProgress ? "text-amber-700" :
                step.locked ? "text-slate-400" :
                "text-slate-600"
              }`}>
                {step.label}
                {step.inProgress && <span className="ml-2 text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">In Progress</span>}
                {step.locked && <span className="ml-2 text-xs">🔒</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">What happens next?</p>
          <ul className="space-y-1 text-blue-700 list-disc list-inside">
            <li>Our admin team reviews your business details</li>
            <li>Verification typically takes 1–2 business days</li>
            <li>You&apos;ll be notified once your account is verified</li>
            <li>After verification, you can create and publish listings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Rejected Panel ───────────────────────────────────────────────────────────

function RejectedPanel({ provider, onReapply }: { provider: ApiProvider; onReapply: () => void }) {
  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Application Rejected</h2>
            <p className="text-sm text-slate-500">Your provider application was not approved</p>
          </div>
        </div>
        {provider.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-800">
            <p className="font-semibold mb-1">Reason:</p>
            <p>{provider.rejection_reason}</p>
          </div>
        )}
        <p className="text-sm text-slate-600 mb-5">Please review the reason above, make the necessary corrections to your business information, and reapply.</p>
        <button onClick={onReapply}
          className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
          Update Profile &amp; Reapply
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function ProviderDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [provider, setProvider] = useState<ApiProvider | null>(null);
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showNewListing, setShowNewListing] = useState(false);
  const [imageManagerListing, setImageManagerListing] = useState<ApiListing | null>(null);

  const loadData = useCallback(async () => {
    setPageLoading(true);
    try {
      const [prov, listingData] = await Promise.allSettled([
        providersApi.getMyProfile(),
        listingsApi.list(),
      ]);
      if (prov.status === "fulfilled") setProvider(prov.value);
      if (listingData.status === "fulfilled") {
        const uid = user?.id;
        setListings(uid ? listingData.value.filter((l) => l.provider_id === prov.status === "fulfilled" ? prov.value.id : false) : []);
      }
    } finally {
      setPageLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "PROVIDER") { router.push("/"); return; }
    loadData();
  }, [user, loading, router, loadData]);

  if (loading || pageLoading) return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // No provider profile yet → redirect to register
  if (!provider) return (
    <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Complete Your Provider Profile</h2>
        <p className="text-slate-500 text-sm mb-6">You need to set up your business profile before you can manage listings.</p>
        <Link href="/providers/register" className="block w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors text-center">
          Set Up Provider Profile
        </Link>
      </div>
    </div>
  );

  // Pending verification
  if (provider.verification_status === "PENDING") return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Provider Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{provider.business_name}</p>
        </div>
        <PendingVerificationPanel provider={provider} />
      </div>
    </div>
  );

  // Rejected
  if (provider.verification_status === "REJECTED") return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Provider Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{provider.business_name}</p>
        </div>
        <RejectedPanel provider={provider} onReapply={() => router.push("/providers/register")} />
      </div>
    </div>
  );

  // Verified — full dashboard
  const activeListing = listings.filter((l) => l.status === "ACTIVE").length;
  const pendingListings = listings.filter((l) => l.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {showNewListing && (
        <NewListingModal
          onClose={() => setShowNewListing(false)}
          onCreated={(l) => { setListings((p) => [l, ...p]); setShowNewListing(false); }}
        />
      )}
      {imageManagerListing && (
        <ImageManagerModal listing={imageManagerListing} onClose={() => setImageManagerListing(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Provider Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">{provider.business_name} · <StatusBadge status={provider.verification_status} /></p>
          </div>
          <button onClick={() => setShowNewListing(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Listing
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Listings", value: listings.length, icon: "🏠" },
            { label: "Active Listings", value: activeListing, icon: "✅" },
            { label: "Pending Review", value: pendingListings, icon: "⏳" },
            { label: "Account Status", value: provider.verification_status, icon: "🔐" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">{label}</span>
                <span className="text-lg">{icon}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{typeof value === "number" ? value : <StatusBadge status={value} />}</p>
            </div>
          ))}
        </div>

        {/* Listings table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Your Listings</h2>
            <button onClick={loadData} className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">Refresh</button>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg mb-2">No listings yet</p>
              <p className="text-sm mb-6">Create your first listing to get started</p>
              <button onClick={() => setShowNewListing(true)}
                className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Create Listing
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3 text-slate-500 font-medium">Listing</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">Care Type</th>
                    <th className="text-left px-4 py-3 text-slate-500 font-medium">Location</th>
                    <th className="text-right px-4 py-3 text-slate-500 font-medium">Price</th>
                    <th className="text-center px-4 py-3 text-slate-500 font-medium">Status</th>
                    <th className="text-right px-6 py-3 text-slate-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 truncate max-w-[180px]">{l.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">ID: {l.id.slice(0, 8)}…</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                        {CARE_TYPE_LABELS[l.care_type] ?? l.care_type}
                      </td>
                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                        {[l.city, l.state].filter(Boolean).join(", ") || "—"}
                      </td>
                      <td className="px-4 py-4 text-right text-slate-700 font-medium whitespace-nowrap">
                        {l.price ? `$${l.price.toLocaleString()}/mo` : "—"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={l.status} />
                        {l.status === "PENDING" && (
                          <p className="text-xs text-amber-600 mt-1 whitespace-nowrap">Under review</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setImageManagerListing(l)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-teal-300 hover:text-teal-600 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Images
                          </button>
                          <Link href={`/providers/listings/${l.id}`}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:border-teal-300 hover:text-teal-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

