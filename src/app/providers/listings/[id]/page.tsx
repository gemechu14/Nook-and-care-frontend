"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/authStore";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import {
  listingFeaturesApi,
  type ListingActivityRecord,
  type ListingAmenityRecord,
  type ListingCertificationRecord,
  type ListingDiningOptionRecord,
  type ListingEquipmentRecord,
  type ListingHouseRuleRecord,
  type ListingInsuranceOptionRecord,
  type ListingLanguageRecord,
  type ListingSafetyFeatureRecord,
  type ListingServiceRecord,
} from "@/services/listingFeaturesService";
import { catalogApi } from "@/services/catalogService";
import { providersApi } from "@/features/providers/services";
import type {
  Activity,
  Amenity,
  ApiCareType,
  ApiListing,
  ApiListingImage,
  Certification,
  DiningOption,
  Equipment,
  HouseRule,
  InsuranceOption,
  Language,
  SafetyFeature,
  TreatmentService,
  UpdateListingRequest,
} from "@/types";
import { FeaturePanel } from "./_components/FeaturePanel";
import { ListingDetailsForm } from "./_components/ListingDetailsForm";
import { ListingManageHeader } from "./_components/ListingManageHeader";
import { ListingImagesTab } from "./_components/ListingImagesTab";
import { ListingLocationForm } from "./_components/ListingLocationForm";
import { ListingManageTabs } from "./_components/ListingManageTabs";
import type { ListingTabItem, TabId } from "./_components/listingManage.types";

type CatalogState = {
  amenities: Amenity[];
  activities: Activity[];
  languages: Language[];
  certifications: Certification[];
  diningOptions: DiningOption[];
  safetyFeatures: SafetyFeature[];
  insuranceOptions: InsuranceOption[];
  houseRules: HouseRule[];
  equipment: Equipment[];
  services: TreatmentService[];
};

type ActiveFeaturesState = {
  amenities: ListingAmenityRecord[];
  activities: ListingActivityRecord[];
  languages: ListingLanguageRecord[];
  certifications: ListingCertificationRecord[];
  diningOptions: ListingDiningOptionRecord[];
  safetyFeatures: ListingSafetyFeatureRecord[];
  insuranceOptions: ListingInsuranceOptionRecord[];
  houseRules: ListingHouseRuleRecord[];
  equipment: ListingEquipmentRecord[];
  services: ListingServiceRecord[];
};

const EMPTY_CATALOG: CatalogState = {
  amenities: [],
  activities: [],
  languages: [],
  certifications: [],
  diningOptions: [],
  safetyFeatures: [],
  insuranceOptions: [],
  houseRules: [],
  equipment: [],
  services: [],
};

const EMPTY_ACTIVE_FEATURES: ActiveFeaturesState = {
  amenities: [],
  activities: [],
  languages: [],
  certifications: [],
  diningOptions: [],
  safetyFeatures: [],
  insuranceOptions: [],
  houseRules: [],
  equipment: [],
  services: [],
};

const CARE_TYPES: ApiCareType[] = [
  "ASSISTED_LIVING",
  "MEMORY_CARE",
  "INDEPENDENT_LIVING",
  "ADULT_FAMILY_HOME",
  "SKILLED_NURSING",
];

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
  const [catalog, setCatalog] = useState<CatalogState>(EMPTY_CATALOG);
  const [activeFeatures, setActiveFeatures] =
    useState<ActiveFeaturesState>(EMPTY_ACTIVE_FEATURES);
  const [detailsForm, setDetailsForm] = useState<Partial<UpdateListingRequest>>({});
  const [detailsSaving, setDetailsSaving] = useState(false);
  const [detailsSuccess, setDetailsSuccess] = useState(false);
  const [locationForm, setLocationForm] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [locationSaving, setLocationSaving] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const refreshImages = useCallback(async () => {
    if (!id) return;
    const imgs = await listingImagesApi.getByListing(id).catch(() => []);
    setImages(imgs);
  }, [id]);

  const fetchAll = useCallback(async (listingId: string, currentUser: typeof user) => {
    try {
      setFetchError(null);
      const data = await listingsApi.getById(listingId);

      if (currentUser?.role === "PROVIDER") {
        const providers = await providersApi.list({ limit: 100 }).catch(() => []);
        const userProvider = providers.find((provider) => provider.user_id === currentUser.id);
        if (!userProvider || data.provider_id !== userProvider.id) {
          setFetchError("You don't have permission to manage this listing.");
          setPageLoading(false);
          return;
        }
      }

      setListing(data);
      setDetailsForm({
        title: data.title,
        description: data.description ?? "",
        care_type: data.care_type,
        city: data.city ?? "",
        state: data.state ?? "",
        address: data.address ?? "",
        price: data.price ?? undefined,
        capacity: data.capacity ?? undefined,
        phone: data.phone ?? "",
        email: data.email ?? "",
        license_number: data.license_number ?? "",
        has_24_hour_care: data.has_24_hour_care,
        is_featured: data.is_featured,
      });
      setLocationForm({
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
      });

      const imgs = await listingImagesApi.getByListing(listingId).catch(() => []);
      setImages(imgs);

      const extractFeatures = <T extends { id: string }>(
        items: unknown,
        nestedKey: string,
      ): T[] => {
        if (!items || !Array.isArray(items)) return [];
        return items.map((item: Record<string, unknown>) => {
          const nested = item[nestedKey] as { id?: string } | undefined;
          const base = {
            id: String(item.id ?? ""),
            listing_id: listingId,
            [`${nestedKey}_id`]: nested?.id ?? "",
            created_at: String(item.created_at ?? new Date().toISOString()),
          } as Record<string, unknown>;

          if (nestedKey === "certification") base.license_number = item.license_number ?? null;
          if (nestedKey === "house_rule") base.display_order = item.display_order ?? 0;
          if (nestedKey === "equipment") base.quantity = item.quantity ?? 1;
          if (nestedKey === "treatment_service") {
            base.price = item.price ?? null;
            base.is_included = item.is_included ?? false;
          }
          return base as T;
        });
      };

      const [
        amenitiesCat,
        activitiesCat,
        langCat,
        certCat,
        diningCat,
        safetyCat,
        insuranceCat,
        rulesCat,
        equipCat,
        servicesCat,
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

      const listingData = data as unknown as Record<string, unknown>;
      setActiveFeatures({
        amenities: extractFeatures<ListingAmenityRecord>(listingData.amenities, "amenity"),
        activities: extractFeatures<ListingActivityRecord>(listingData.activities, "activity"),
        languages: extractFeatures<ListingLanguageRecord>(listingData.languages, "language"),
        certifications: extractFeatures<ListingCertificationRecord>(
          listingData.certifications,
          "certification",
        ),
        diningOptions: extractFeatures<ListingDiningOptionRecord>(
          listingData.dining_options,
          "dining_option",
        ),
        safetyFeatures: extractFeatures<ListingSafetyFeatureRecord>(
          listingData.safety_features,
          "safety_feature",
        ),
        insuranceOptions: extractFeatures<ListingInsuranceOptionRecord>(
          listingData.insurance_options,
          "insurance_option",
        ),
        houseRules: extractFeatures<ListingHouseRuleRecord>(listingData.house_rules, "house_rule"),
        equipment: extractFeatures<ListingEquipmentRecord>(listingData.equipment, "equipment"),
        services: extractFeatures<ListingServiceRecord>(
          listingData.services,
          "treatment_service",
        ),
      });
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load listing.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "PROVIDER" && user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    if (id) void fetchAll(id, user);
  }, [user, loading, router, id, fetchAll]);

  const saveDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!listing) return;
    setDetailsSaving(true);
    setDetailsSuccess(false);
    try {
      const updated = await listingsApi.update(listing.id, detailsForm);
      setListing(updated);
      setDetailsSuccess(true);
    } finally {
      setDetailsSaving(false);
    }
  };

  const saveLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!listing) return;
    setLocationSaving(true);
    setLocationSuccess(false);
    try {
      const updated = await listingsApi.update(listing.id, {
        latitude: locationForm.latitude ?? undefined,
        longitude: locationForm.longitude ?? undefined,
      });
      setListing(updated);
      setLocationSuccess(true);
    } finally {
      setLocationSaving(false);
    }
  };

  useEffect(() => {
    if (!locationSuccess) return;
    const timer = window.setTimeout(() => setLocationSuccess(false), 2000);
    return () => window.clearTimeout(timer);
  }, [locationSuccess]);

  const makeFeatureHandlers = <R extends { id: string }>(
    featureKey: keyof ActiveFeaturesState,
    addFn: (data: Record<string, unknown>) => Promise<R>,
    addBatchFn: ((items: Record<string, unknown>[]) => Promise<R[]>) | undefined,
    removeBatchFn: ((items: Record<string, unknown>[]) => Promise<R[]>) | undefined,
    buildPayload: (itemId: string) => Record<string, unknown>,
    getItemId: (record: R) => string,
  ) => ({
    onAdd: async (itemId: string) => {
      if (!listing) return;
      setSavingId(itemId);
      try {
        const record = await addFn(buildPayload(itemId));
        setActiveFeatures((prev) => ({
          ...prev,
          [featureKey]: [...(prev[featureKey] as unknown as R[]), record as unknown as never],
        }));
      } finally {
        setSavingId(null);
      }
    },
    onAddBatch: addBatchFn
      ? async (itemIds: string[]) => {
          if (!listing || itemIds.length === 0) return;
          const payloads = itemIds.map(buildPayload);
          const records = await addBatchFn(payloads);
          setActiveFeatures((prev) => ({
            ...prev,
            [featureKey]: [
              ...(prev[featureKey] as unknown as R[]),
              ...(records as unknown as R[]),
            ] as unknown as never[],
          }));
        }
      : undefined,
    onRemove: async (recordId: string) => {
      const records = activeFeatures[featureKey] as unknown as R[];
      const found = records.find((record) => record.id === recordId);
      if (!found) return;
      setSavingId(getItemId(found));
      try {
        await listingFeaturesApi[featureKey as keyof typeof listingFeaturesApi].remove(recordId);
        setActiveFeatures((prev) => ({
          ...prev,
          [featureKey]: (prev[featureKey] as unknown as R[]).filter(
            (record) => record.id !== recordId,
          ) as unknown as never[],
        }));
      } finally {
        setSavingId(null);
      }
    },
    onRemoveBatch: removeBatchFn
      ? async (itemIds: string[]) => {
          if (!listing || itemIds.length === 0) return;
          const payloads = itemIds.map(buildPayload);
          await removeBatchFn(payloads);
          const itemIdSet = new Set(itemIds);
          setActiveFeatures((prev) => ({
            ...prev,
            [featureKey]: (prev[featureKey] as unknown as R[]).filter(
              (record) => !itemIdSet.has(getItemId(record)),
            ) as unknown as never[],
          }));
        }
      : undefined,
  });

  const addServicesWithPrice = async (items: { itemId: string; price: number }[]) => {
    if (!listing || items.length === 0) return;
    const payloads = items.map((item) => ({
      listing_id: listing.id,
      treatment_service_id: item.itemId,
      price: item.price,
    }));
    const records = await listingFeaturesApi.services.addBatch(payloads);
    setActiveFeatures((prev) => ({
      ...prev,
      services: [...prev.services, ...records],
    }));
  };

  const tabs: ListingTabItem[] = [
    {
      id: "details",
      label: "Details",
      description: "Core listing content and contact data",
    },
    {
      id: "images",
      label: "Images",
      description: "Upload and arrange gallery photos",
      count: images.length,
    },
    {
      id: "location",
      label: "Location",
      description: "Latitude and longitude for maps",
    },
    {
      id: "features",
      label: "Features",
      description: "Amenities, services, safety and policies",
      count:
        activeFeatures.amenities.length +
        activeFeatures.activities.length +
        activeFeatures.languages.length +
        activeFeatures.certifications.length +
        activeFeatures.diningOptions.length +
        activeFeatures.safetyFeatures.length +
        activeFeatures.insuranceOptions.length +
        activeFeatures.houseRules.length +
        activeFeatures.equipment.length +
        activeFeatures.services.length,
    },
  ];

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="font-medium text-slate-600">
          {fetchError ?? "Listing not found or you don't have permission to view it."}
        </p>
        <Link
          href="/providers/dashboard?nav=listings"
          className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          ← Back to listings
        </Link>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <ListingManageHeader listing={listing} imageCount={images.length} />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Listing Workspace
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Manage all listing details from one place
            </h2>
          </div>
          <ListingManageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="relative">
          {activeTab === "details" ? (
            <ListingDetailsForm
              careTypes={CARE_TYPES}
              detailsForm={detailsForm}
              detailsSaving={detailsSaving}
              detailsSuccess={detailsSuccess}
              onSubmit={saveDetails}
              onChange={(update) => setDetailsForm((prev) => ({ ...prev, ...update }))}
            />
          ) : null}

          {activeTab === "images" ? (
            <ListingImagesTab listing={listing} images={images} onRefresh={refreshImages} />
          ) : null}

          {activeTab === "location" ? (
            <ListingLocationForm
              latitude={locationForm.latitude}
              longitude={locationForm.longitude}
              saving={locationSaving}
              success={locationSuccess}
              onSave={saveLocation}
              onLatitudeChange={(v) => setLocationForm((p) => ({ ...p, latitude: v }))}
              onLongitudeChange={(v) => setLocationForm((p) => ({ ...p, longitude: v }))}
            />
          ) : null}

          {activeTab === "features" ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Lifestyle & Daily Living
                </h4>
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Amenities"
                      catalogItems={catalog.amenities}
                      activeRecords={activeFeatures.amenities}
                      getItemId={(record) => record.amenity_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "amenities",
                        listingFeaturesApi.amenities.add,
                        listingFeaturesApi.amenities.addBatch,
                        listingFeaturesApi.amenities.removeBatch,
                        (itemId) => ({ listing_id: listing.id, amenity_id: itemId }),
                        (record) => record.amenity_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Activities"
                      catalogItems={catalog.activities}
                      activeRecords={activeFeatures.activities}
                      getItemId={(record) => record.activity_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "activities",
                        listingFeaturesApi.activities.add,
                        listingFeaturesApi.activities.addBatch,
                        listingFeaturesApi.activities.removeBatch,
                        (itemId) => ({ listing_id: listing.id, activity_id: itemId }),
                        (record) => record.activity_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Languages"
                      catalogItems={catalog.languages}
                      activeRecords={activeFeatures.languages}
                      getItemId={(record) => record.language_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "languages",
                        listingFeaturesApi.languages.add,
                        listingFeaturesApi.languages.addBatch,
                        listingFeaturesApi.languages.removeBatch,
                        (itemId) => ({ listing_id: listing.id, language_id: itemId }),
                        (record) => record.language_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Dining Options"
                      catalogItems={catalog.diningOptions}
                      activeRecords={activeFeatures.diningOptions}
                      getItemId={(record) => record.dining_option_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "diningOptions",
                        listingFeaturesApi.diningOptions.add,
                        listingFeaturesApi.diningOptions.addBatch,
                        listingFeaturesApi.diningOptions.removeBatch,
                        (itemId) => ({ listing_id: listing.id, dining_option_id: itemId }),
                        (record) => record.dining_option_id,
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Compliance, Safety & Policy
                </h4>
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Certifications"
                      catalogItems={catalog.certifications}
                      activeRecords={activeFeatures.certifications}
                      getItemId={(record) => record.certification_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "certifications",
                        listingFeaturesApi.certifications.add,
                        listingFeaturesApi.certifications.addBatch,
                        listingFeaturesApi.certifications.removeBatch,
                        (itemId) => ({ listing_id: listing.id, certification_id: itemId }),
                        (record) => record.certification_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Safety Features"
                      catalogItems={catalog.safetyFeatures}
                      activeRecords={activeFeatures.safetyFeatures}
                      getItemId={(record) => record.safety_feature_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "safetyFeatures",
                        listingFeaturesApi.safetyFeatures.add,
                        listingFeaturesApi.safetyFeatures.addBatch,
                        listingFeaturesApi.safetyFeatures.removeBatch,
                        (itemId) => ({ listing_id: listing.id, safety_feature_id: itemId }),
                        (record) => record.safety_feature_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Insurance Options"
                      catalogItems={catalog.insuranceOptions}
                      activeRecords={activeFeatures.insuranceOptions}
                      getItemId={(record) => record.insurance_option_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "insuranceOptions",
                        listingFeaturesApi.insuranceOptions.add,
                        listingFeaturesApi.insuranceOptions.addBatch,
                        listingFeaturesApi.insuranceOptions.removeBatch,
                        (itemId) => ({ listing_id: listing.id, insurance_option_id: itemId }),
                        (record) => record.insurance_option_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="House Rules"
                      catalogItems={catalog.houseRules}
                      activeRecords={activeFeatures.houseRules}
                      getItemId={(record) => record.house_rule_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "houseRules",
                        listingFeaturesApi.houseRules.add,
                        listingFeaturesApi.houseRules.addBatch,
                        listingFeaturesApi.houseRules.removeBatch,
                        (itemId) => ({ listing_id: listing.id, house_rule_id: itemId }),
                        (record) => record.house_rule_id,
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Care Delivery
                </h4>
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Equipment"
                      catalogItems={catalog.equipment}
                      activeRecords={activeFeatures.equipment}
                      getItemId={(record) => record.equipment_id}
                      savingId={savingId}
                      {...makeFeatureHandlers(
                        "equipment",
                        listingFeaturesApi.equipment.add,
                        listingFeaturesApi.equipment.addBatch,
                        listingFeaturesApi.equipment.removeBatch,
                        (itemId) => ({ listing_id: listing.id, equipment_id: itemId }),
                        (record) => record.equipment_id,
                      )}
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <FeaturePanel
                      title="Treatment Services"
                      catalogItems={catalog.services}
                      activeRecords={activeFeatures.services}
                      getItemId={(record) => record.treatment_service_id}
                      getItemMetaLabel={(record) =>
                        record.price !== null ? `$${record.price}` : null
                      }
                      savingId={savingId}
                      requirePriceOnAdd
                      onAddBatchWithPrice={addServicesWithPrice}
                      {...makeFeatureHandlers(
                        "services",
                        listingFeaturesApi.services.add,
                        undefined,
                        listingFeaturesApi.services.removeBatch,
                        (itemId) => ({ listing_id: listing.id, treatment_service_id: itemId }),
                        (record) => record.treatment_service_id,
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
