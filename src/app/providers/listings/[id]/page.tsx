"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/authStore";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import { listingFeaturesApi } from "@/services/listingFeaturesService";
import { catalogApi } from "@/services/catalogService";
import { providersApi } from "@/features/providers/services";
import type {
  ApiListing, ApiListingImage,
  Amenity, Activity, Language, Certification,
  DiningOption, SafetyFeature, InsuranceOption, HouseRule,
  Equipment, TreatmentService, ApiCareType, UpdateListingRequest,
} from "@/types";
import { CARE_TYPE_LABELS } from "@/types";
import type {
  ListingAmenityRecord, ListingActivityRecord, ListingLanguageRecord,
  ListingCertificationRecord, ListingDiningOptionRecord, ListingSafetyFeatureRecord,
  ListingInsuranceOptionRecord, ListingHouseRuleRecord, ListingEquipmentRecord,
  ListingServiceRecord,
} from "@/services/listingFeaturesService";

type TabId = "details" | "images" | "amenities" | "activities" | "languages" |
  "certifications" | "dining" | "safety" | "insurance" | "rules" | "equipment" | "services";

// ─── Feature Panel with Multi-Select Dropdown ──────────────────────────────────

interface FeaturePanelProps<C extends { id: string; name: string }, R extends { id: string }> {
  title: string; catalogItems: C[]; activeRecords: R[];
  getItemId: (r: R) => string;
  onAdd: (itemId: string) => Promise<void>; 
  onAddBatch?: (itemIds: string[]) => Promise<void>;
  onRemove: (recordId: string) => Promise<void>;
  savingId: string | null;
}

function FeaturePanel<C extends { id: string; name: string }, R extends { id: string }>({
  title, catalogItems, activeRecords, getItemId, onAdd, onAddBatch, onRemove, savingId,
}: FeaturePanelProps<C, R>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const activeItemIds = new Set(activeRecords.map(getItemId));
  const activeMap = new Map(activeRecords.map((r) => [getItemId(r), r.id]));
  
  // Get items that are not yet added
  const availableItems = catalogItems.filter(item => !activeItemIds.has(item.id));
  
  // Get active items with their names
  const activeItems = activeRecords.map(record => {
    const itemId = getItemId(record);
    const catalogItem = catalogItems.find(c => c.id === itemId);
    return { record, itemId, name: catalogItem?.name || itemId };
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedItems(new Set());
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleToggleSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (selectedItems.size === 0) {
      setShowDropdown(false);
      return;
    }

    setIsSaving(true);
    try {
      if (onAddBatch) {
        // Always use batch if available (even for single items)
        await onAddBatch(Array.from(selectedItems));
      } else {
        // Fallback to individual adds if batch not available
        for (const itemId of selectedItems) {
          await onAdd(itemId);
        }
      }
      setSelectedItems(new Set());
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to add items:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (catalogItems.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-xs">No {title.toLowerCase()} in the catalog yet.</div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* Existing Items */}
      {activeItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeItems.map(({ record, itemId, name }) => {
            const isRemoving = savingId === itemId;
            return (
              <div
                key={record.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-xs font-medium text-teal-700"
              >
                <span>{name}</span>
                <button
                  onClick={() => onRemove(record.id)}
                  disabled={isRemoving}
                  className="text-teal-600 hover:text-teal-700 disabled:opacity-50"
                >
                  {isRemoving ? (
                    <span className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No {title.toLowerCase()} added yet.</p>
      )}

      {/* Add Button with Multi-Select Dropdown */}
      {availableItems.length > 0 && (
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (showDropdown) {
                setSelectedItems(new Set());
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-teal-600 border border-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add {title.slice(0, -1)}
            {showDropdown && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="max-h-60 overflow-y-auto mb-2">
                  {availableItems.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelection(item.id)}
                          className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                        />
                        <span className="flex-1">{item.name}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    {selectedItems.size > 0 ? `${selectedItems.size} selected` : "Select items"}
                  </span>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={selectedItems.size === 0 || isSaving}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {availableItems.length === 0 && activeItems.length > 0 && (
        <p className="text-xs text-slate-400">All available {title.toLowerCase()} have been added.</p>
      )}
    </div>
  );
}

// ─── Images Tab ───────────────────────────────────────────────────────────────

function ImagesTab({ listing, images, onRefresh }: { listing: ApiListing; images: ApiListingImage[]; onRefresh: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, isPrimary = false) => {
    setUploading(true);
    setError(null);
    try {
      await listingImagesApi.upload(listing.id, file, images.length, isPrimary);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
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
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach((f, i) => uploadFile(f, i === 0 && images.length === 0));
  };

  const removeImage = async (id: string) => {
    await listingImagesApi.delete(id).catch(() => {});
    onRefresh();
  };

  const setPrimary = async (id: string) => {
    await listingImagesApi.update(id, { is_primary: true }).catch(() => {});
    onRefresh();
  };

  return (
    <div className="space-y-5">
      {/* Upload area */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-colors ${
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
            {uploading ? "Uploading…" : "Drop images here or click to select from your device"}
          </p>
          <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WebP, GIF, BMP — max 10MB each</p>
        </div>
        <input type="file" multiple accept="image/*" onChange={handleFileInput} disabled={uploading} className="sr-only" />
      </label>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {/* Image grid */}
      {images.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-6">No images yet. Upload some using the area above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.sort((a, b) => a.display_order - b.display_order).map((img) => {
            const src = img.image_url ?? listingImagesApi.getDownloadUrl(img.id);
            return (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                {img.is_primary && (
                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Primary</div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {!img.is_primary && (
                    <button onClick={() => setPrimary(img.id)}
                      className="w-full bg-white text-slate-700 text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors">
                      Set Primary
                    </button>
                  )}
                  <button onClick={() => removeImage(img.id)}
                    className="w-full bg-red-600 text-white text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ListingManagePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [listing, setListing] = useState<ApiListing | null>(null);
  const [images, setImages] = useState<ApiListingImage[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<{
    amenities: Amenity[]; activities: Activity[]; languages: Language[];
    certifications: Certification[]; diningOptions: DiningOption[];
    safetyFeatures: SafetyFeature[]; insuranceOptions: InsuranceOption[];
    houseRules: HouseRule[]; equipment: Equipment[]; services: TreatmentService[];
  }>({ amenities: [], activities: [], languages: [], certifications: [], diningOptions: [], safetyFeatures: [], insuranceOptions: [], houseRules: [], equipment: [], services: [] });

  const [activeFeatures, setActiveFeatures] = useState<{
    amenities: ListingAmenityRecord[]; activities: ListingActivityRecord[];
    languages: ListingLanguageRecord[]; certifications: ListingCertificationRecord[];
    diningOptions: ListingDiningOptionRecord[]; safetyFeatures: ListingSafetyFeatureRecord[];
    insuranceOptions: ListingInsuranceOptionRecord[]; houseRules: ListingHouseRuleRecord[];
    equipment: ListingEquipmentRecord[]; services: ListingServiceRecord[];
  }>({ amenities: [], activities: [], languages: [], certifications: [], diningOptions: [], safetyFeatures: [], insuranceOptions: [], houseRules: [], equipment: [], services: [] });

  const [detailsForm, setDetailsForm] = useState<Partial<UpdateListingRequest>>({});
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState(false);

  const refreshImages = useCallback(async () => {
    if (!id) return;
    const imgs = await listingImagesApi.getByListing(id).catch(() => []);
    setImages(imgs);
  }, [id]);

  const fetchAll = useCallback(async (listingId: string, currentUser: typeof user) => {
    try {
      setFetchError(null);
      const data = await listingsApi.getById(listingId);
      
      // Verify ownership for providers (admins can access any)
      if (currentUser?.role === "PROVIDER") {
        const providers = await providersApi.list({ limit: 100 }).catch(() => []);
        const userProvider = providers.find((p) => p.user_id === currentUser.id);
        if (!userProvider || data.provider_id !== userProvider.id) {
          setFetchError("You don't have permission to manage this listing.");
          setPageLoading(false);
          return;
        }
      }
      
      setListing(data);
      setDetailsForm({
        title: data.title, description: data.description ?? "",
        care_type: data.care_type, city: data.city ?? "",
        state: data.state ?? "", address: data.address ?? "",
        price: data.price ?? undefined, capacity: data.capacity ?? undefined,
        phone: data.phone ?? "", email: data.email ?? "",
        license_number: data.license_number ?? "",
        has_24_hour_care: data.has_24_hour_care, is_featured: data.is_featured,
      });
      const imgs = await listingImagesApi.getByListing(listingId).catch(() => []);
      setImages(imgs);

      const [
        amenitiesCat, activitiesCat, langCat, certCat, diningCat,
        safetyCat, insuranceCat, rulesCat, equipCat, servicesCat,
        amenitiesActive, activitiesActive, langActive, certActive, diningActive,
        safetyActive, insuranceActive, rulesActive, equipActive, servicesActive,
      ] = await Promise.allSettled([
        catalogApi.amenities.list({ limit: 200 }),
        catalogApi.activities.list({ limit: 200 }),
        catalogApi.languages.list({ limit: 200 }),
        catalogApi.certifications.list({ limit: 200 }),
        catalogApi.diningOptions.list({ limit: 200 }),
        catalogApi.safetyFeatures.list({ limit: 200 }),
        catalogApi.insuranceOptions.list({ limit: 200 }),
        catalogApi.houseRules.list({ limit: 200 }),
        catalogApi.equipment.list({ limit: 200 }),
        catalogApi.treatmentServices.list({ limit: 200 }),
        listingFeaturesApi.amenities.list(listingId),
        listingFeaturesApi.activities.list(listingId),
        listingFeaturesApi.languages.list(listingId),
        listingFeaturesApi.certifications.list(listingId),
        listingFeaturesApi.diningOptions.list(listingId),
        listingFeaturesApi.safetyFeatures.list(listingId),
        listingFeaturesApi.insuranceOptions.list(listingId),
        listingFeaturesApi.houseRules.list(listingId),
        listingFeaturesApi.equipment.list(listingId),
        listingFeaturesApi.services.list(listingId),
      ]);

      setCatalog({
        amenities: amenitiesCat.status === "fulfilled" ? amenitiesCat.value : [],
        activities: activitiesCat.status === "fulfilled" ? activitiesCat.value : [],
        languages: langCat.status === "fulfilled" ? langCat.value : [],
        certifications: certCat.status === "fulfilled" ? certCat.value : [],
        diningOptions: diningCat.status === "fulfilled" ? diningCat.value : [],
        safetyFeatures: safetyCat.status === "fulfilled" ? safetyCat.value : [],
        insuranceOptions: insuranceCat.status === "fulfilled" ? insuranceCat.value : [],
        houseRules: rulesCat.status === "fulfilled" ? rulesCat.value : [],
        equipment: equipCat.status === "fulfilled" ? equipCat.value : [],
        services: servicesCat.status === "fulfilled" ? servicesCat.value : [],
      });
      setActiveFeatures({
        amenities: amenitiesActive.status === "fulfilled" ? amenitiesActive.value : [],
        activities: activitiesActive.status === "fulfilled" ? activitiesActive.value : [],
        languages: langActive.status === "fulfilled" ? langActive.value : [],
        certifications: certActive.status === "fulfilled" ? certActive.value : [],
        diningOptions: diningActive.status === "fulfilled" ? diningActive.value : [],
        safetyFeatures: safetyActive.status === "fulfilled" ? safetyActive.value : [],
        insuranceOptions: insuranceActive.status === "fulfilled" ? insuranceActive.value : [],
        houseRules: rulesActive.status === "fulfilled" ? rulesActive.value : [],
        equipment: equipActive.status === "fulfilled" ? equipActive.value : [],
        services: servicesActive.status === "fulfilled" ? servicesActive.value : [],
      });
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load listing.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "PROVIDER" && user.role !== "ADMIN") { router.push("/"); return; }
    if (id) fetchAll(id, user);
  }, [user, loading, router, id, fetchAll]);

  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setDetailsSaving(true); setDetailsSuccess(false);
    try {
      const updated = await listingsApi.update(listing.id, detailsForm);
      setListing(updated); setDetailsSuccess(true);
    } finally { setDetailsSaving(false); }
  };

  const makeFeatureHandlers = <C extends { id: string; name: string }, R extends { id: string }>(
    featureKey: keyof typeof activeFeatures,
    addFn: (data: Record<string, unknown>) => Promise<R>,
    addBatchFn: ((items: Record<string, unknown>[]) => Promise<R[]>) | undefined,
    removeBatchFn: ((items: Record<string, unknown>[]) => Promise<R[]>) | undefined,
    buildPayload: (itemId: string) => Record<string, unknown>,
    getItemId: (r: R) => string,
  ) => ({
    onAdd: async (itemId: string) => {
      if (!listing) return;
      setSavingId(itemId);
      try {
        const record = await addFn(buildPayload(itemId));
        setActiveFeatures((prev) => ({ ...prev, [featureKey]: [...(prev[featureKey] as unknown as R[]), record as unknown as R] }));
      } finally { setSavingId(null); }
    },
    onAddBatch: addBatchFn ? async (itemIds: string[]) => {
      if (!listing || itemIds.length === 0) return;
      try {
        const payloads = itemIds.map(buildPayload);
        const records = await addBatchFn(payloads);
        setActiveFeatures((prev) => ({ ...prev, [featureKey]: [...(prev[featureKey] as unknown as R[]), ...records as unknown as R[]] }));
      } catch (error) {
        console.error("Batch add failed:", error);
        throw error;
      }
    } : undefined,
    onRemove: async (recordId: string) => {
      const records = activeFeatures[featureKey] as unknown as R[];
      const rec = records.find((r) => r.id === recordId);
      if (!rec) return;
      setSavingId(getItemId(rec));
      try {
        await listingFeaturesApi[featureKey as keyof typeof listingFeaturesApi].remove(recordId);
        setActiveFeatures((prev) => ({ ...prev, [featureKey]: (prev[featureKey] as unknown as R[]).filter((r) => r.id !== recordId) }));
      } finally { setSavingId(null); }
    },
    onRemoveBatch: removeBatchFn ? async (itemIds: string[]) => {
      if (!listing || itemIds.length === 0) return;
      try {
        const payloads = itemIds.map(buildPayload);
        await removeBatchFn(payloads);
        const itemIdSet = new Set(itemIds);
        setActiveFeatures((prev) => ({ 
          ...prev, 
          [featureKey]: (prev[featureKey] as unknown as R[]).filter((r) => !itemIdSet.has(getItemId(r))) 
        }));
      } catch (error) {
        console.error("Batch remove failed:", error);
        throw error;
      }
    } : undefined,
  });

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "details", label: "Details" },
    { id: "images", label: "Images", count: images.length },
    { id: "amenities", label: "Amenities", count: activeFeatures.amenities.length },
    { id: "activities", label: "Activities", count: activeFeatures.activities.length },
    { id: "languages", label: "Languages", count: activeFeatures.languages.length },
    { id: "certifications", label: "Certifications", count: activeFeatures.certifications.length },
    { id: "dining", label: "Dining", count: activeFeatures.diningOptions.length },
    { id: "safety", label: "Safety", count: activeFeatures.safetyFeatures.length },
    { id: "insurance", label: "Insurance", count: activeFeatures.insuranceOptions.length },
    { id: "rules", label: "House Rules", count: activeFeatures.houseRules.length },
    { id: "equipment", label: "Equipment", count: activeFeatures.equipment.length },
    { id: "services", label: "Services", count: activeFeatures.services.length },
  ];

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!listing) return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center min-h-[400px]">
      <p className="text-slate-600 font-medium">{fetchError ?? "Listing not found or you don't have permission to view it."}</p>
      <Link href="/providers/dashboard?nav=listings" className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors">← Back to listings</Link>
    </div>
  );

  const CARE_TYPES: ApiCareType[] = ["ASSISTED_LIVING", "MEMORY_CARE", "INDEPENDENT_LIVING", "ADULT_FAMILY_HOME", "SKILLED_NURSING"];

  return (
    <div className="space-y-6">
      <div>
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{listing.title}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {CARE_TYPE_LABELS[listing.care_type]} · {[listing.city, listing.state].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                listing.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                listing.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                "bg-slate-100 text-slate-600"
              }`}>{listing.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex overflow-x-auto border-b border-slate-100">
          {tabs.map(({ id: tabId, label, count }) => (
            <button 
              key={tabId} 
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-1.5 px-4 sm:px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tabId 
                  ? "border-teal-600 text-teal-600 bg-teal-50/50" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
              {count !== undefined && count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  activeTab === tabId 
                    ? "bg-teal-600 text-white" 
                    : "bg-slate-200 text-slate-600"
                }`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6 relative overflow-visible">
          {/* Details Tab */}
          {activeTab === "details" && (
            <form onSubmit={saveDetails} className="space-y-5">
              {detailsSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-medium">
                  Changes saved successfully!
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Title</label>
                  <input 
                    value={detailsForm.title ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Care Type</label>
                  <select 
                    value={detailsForm.care_type ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, care_type: e.target.value as ApiCareType }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white transition-colors"
                  >
                    {CARE_TYPES.map((ct) => <option key={ct} value={ct}>{CARE_TYPE_LABELS[ct]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Price ($/mo)</label>
                  <input 
                    type="number" 
                    value={detailsForm.price ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, price: Number(e.target.value) || undefined }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">City</label>
                  <input 
                    value={detailsForm.city ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">State</label>
                  <input 
                    value={detailsForm.state ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, state: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Address</label>
                  <input 
                    value={detailsForm.address ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
                  <input 
                    value={detailsForm.phone ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={detailsForm.email ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Capacity</label>
                  <input 
                    type="number" 
                    value={detailsForm.capacity ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, capacity: Number(e.target.value) || undefined }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">License Number</label>
                  <input 
                    value={detailsForm.license_number ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, license_number: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors bg-white" 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                  <textarea 
                    value={detailsForm.description ?? ""} 
                    onChange={(e) => setDetailsForm((p) => ({ ...p, description: e.target.value }))}
                    rows={4} 
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none transition-colors bg-white" 
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2.5 p-3 bg-slate-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="has24" 
                    checked={!!detailsForm.has_24_hour_care}
                    onChange={(e) => setDetailsForm((p) => ({ ...p, has_24_hour_care: e.target.checked }))}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer" 
                  />
                  <label htmlFor="has24" className="text-xs font-medium text-slate-700 cursor-pointer">
                    24-Hour Care Available
                  </label>
                </div>
              </div>
              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button 
                  type="submit" 
                  disabled={detailsSaving}
                  className="bg-teal-600 text-white px-5 py-2 text-sm rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {detailsSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

            {/* ── Images ── */}
            {activeTab === "images" && (
              <ImagesTab listing={listing} images={images} onRefresh={refreshImages} />
            )}

            {/* ── Feature panels ── */}
            {activeTab === "amenities" && (
              <FeaturePanel title="Amenities" catalogItems={catalog.amenities} activeRecords={activeFeatures.amenities}
                getItemId={(r) => r.amenity_id}
                savingId={savingId}
                {...makeFeatureHandlers("amenities", listingFeaturesApi.amenities.add, listingFeaturesApi.amenities.addBatch, listingFeaturesApi.amenities.removeBatch, (id) => ({ listing_id: listing.id, amenity_id: id }), (r) => r.amenity_id)} />
            )}
            {activeTab === "activities" && (
              <FeaturePanel title="Activities" catalogItems={catalog.activities} activeRecords={activeFeatures.activities}
                getItemId={(r) => r.activity_id} savingId={savingId}
                {...makeFeatureHandlers("activities", listingFeaturesApi.activities.add, listingFeaturesApi.activities.addBatch, listingFeaturesApi.activities.removeBatch, (id) => ({ listing_id: listing.id, activity_id: id }), (r) => r.activity_id)} />
            )}
            {activeTab === "languages" && (
              <FeaturePanel title="Languages" catalogItems={catalog.languages} activeRecords={activeFeatures.languages}
                getItemId={(r) => r.language_id} savingId={savingId}
                {...makeFeatureHandlers("languages", listingFeaturesApi.languages.add, listingFeaturesApi.languages.addBatch, listingFeaturesApi.languages.removeBatch, (id) => ({ listing_id: listing.id, language_id: id }), (r) => r.language_id)} />
            )}
            {activeTab === "certifications" && (
              <FeaturePanel title="Certifications" catalogItems={catalog.certifications} activeRecords={activeFeatures.certifications}
                getItemId={(r) => r.certification_id} savingId={savingId}
                {...makeFeatureHandlers("certifications", listingFeaturesApi.certifications.add, listingFeaturesApi.certifications.addBatch, listingFeaturesApi.certifications.removeBatch, (id) => ({ listing_id: listing.id, certification_id: id }), (r) => r.certification_id)} />
            )}
            {activeTab === "dining" && (
              <FeaturePanel title="Dining Options" catalogItems={catalog.diningOptions} activeRecords={activeFeatures.diningOptions}
                getItemId={(r) => r.dining_option_id} savingId={savingId}
                {...makeFeatureHandlers("diningOptions", listingFeaturesApi.diningOptions.add, listingFeaturesApi.diningOptions.addBatch, listingFeaturesApi.diningOptions.removeBatch, (id) => ({ listing_id: listing.id, dining_option_id: id }), (r) => r.dining_option_id)} />
            )}
            {activeTab === "safety" && (
              <FeaturePanel title="Safety Features" catalogItems={catalog.safetyFeatures} activeRecords={activeFeatures.safetyFeatures}
                getItemId={(r) => r.safety_feature_id} savingId={savingId}
                {...makeFeatureHandlers("safetyFeatures", listingFeaturesApi.safetyFeatures.add, listingFeaturesApi.safetyFeatures.addBatch, listingFeaturesApi.safetyFeatures.removeBatch, (id) => ({ listing_id: listing.id, safety_feature_id: id }), (r) => r.safety_feature_id)} />
            )}
            {activeTab === "insurance" && (
              <FeaturePanel title="Insurance Options" catalogItems={catalog.insuranceOptions} activeRecords={activeFeatures.insuranceOptions}
                getItemId={(r) => r.insurance_option_id} savingId={savingId}
                {...makeFeatureHandlers("insuranceOptions", listingFeaturesApi.insuranceOptions.add, listingFeaturesApi.insuranceOptions.addBatch, listingFeaturesApi.insuranceOptions.removeBatch, (id) => ({ listing_id: listing.id, insurance_option_id: id }), (r) => r.insurance_option_id)} />
            )}
            {activeTab === "rules" && (
              <FeaturePanel title="House Rules" catalogItems={catalog.houseRules} activeRecords={activeFeatures.houseRules}
                getItemId={(r) => r.house_rule_id} savingId={savingId}
                {...makeFeatureHandlers("houseRules", listingFeaturesApi.houseRules.add, listingFeaturesApi.houseRules.addBatch, listingFeaturesApi.houseRules.removeBatch, (id) => ({ listing_id: listing.id, house_rule_id: id }), (r) => r.house_rule_id)} />
            )}
            {activeTab === "equipment" && (
              <FeaturePanel title="Equipment" catalogItems={catalog.equipment} activeRecords={activeFeatures.equipment}
                getItemId={(r) => r.equipment_id} savingId={savingId}
                {...makeFeatureHandlers("equipment", listingFeaturesApi.equipment.add, listingFeaturesApi.equipment.addBatch, listingFeaturesApi.equipment.removeBatch, (id) => ({ listing_id: listing.id, equipment_id: id }), (r) => r.equipment_id)} />
            )}
            {activeTab === "services" && (
              <FeaturePanel title="Treatment Services" catalogItems={catalog.services} activeRecords={activeFeatures.services}
                getItemId={(r) => r.treatment_service_id} savingId={savingId}
                {...makeFeatureHandlers("services", listingFeaturesApi.services.add, listingFeaturesApi.services.addBatch, listingFeaturesApi.services.removeBatch, (id) => ({ listing_id: listing.id, treatment_service_id: id }), (r) => r.treatment_service_id)} />
            )}
          </div>
        </div>
    </div>
  );
}

