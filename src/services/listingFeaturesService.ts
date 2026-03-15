import { api } from "@/lib/axios";

export interface ListingAmenityRecord {
  id: string;
  listing_id: string;
  amenity_id: string;
  created_at: string;
}
export interface ListingActivityRecord {
  id: string;
  listing_id: string;
  activity_id: string;
  created_at: string;
}
export interface ListingLanguageRecord {
  id: string;
  listing_id: string;
  language_id: string;
  created_at: string;
}
export interface ListingCertificationRecord {
  id: string;
  listing_id: string;
  certification_id: string;
  license_number: string | null;
  created_at: string;
}
export interface ListingDiningOptionRecord {
  id: string;
  listing_id: string;
  dining_option_id: string;
  created_at: string;
}
export interface ListingSafetyFeatureRecord {
  id: string;
  listing_id: string;
  safety_feature_id: string;
  created_at: string;
}
export interface ListingInsuranceOptionRecord {
  id: string;
  listing_id: string;
  insurance_option_id: string;
  created_at: string;
}
export interface ListingHouseRuleRecord {
  id: string;
  listing_id: string;
  house_rule_id: string;
  display_order: number;
  created_at: string;
}
export interface ListingEquipmentRecord {
  id: string;
  listing_id: string;
  equipment_id: string;
  quantity: number;
  created_at: string;
}
export interface ListingServiceRecord {
  id: string;
  listing_id: string;
  treatment_service_id: string;
  price: number | null;
  is_included: boolean;
  created_at: string;
}

function makeAssoc<T>(resource: string) {
  return {
    list: (listingId: string) =>
      api.get<T[]>(`/${resource}/listing/${listingId}`),
    add: (data: Record<string, unknown>) => api.post<T>(`/${resource}`, data),
    addBatch: (items: Record<string, unknown>[]) => {
      const path = `/${resource}/batch`;
      console.log(`[Batch Add] Calling: ${path}`, { items });
      return api.post<T[]>(path, { items });
    },
    remove: (id: string) => api.delete<void>(`/${resource}/${id}`),
    removeBatch: (items: Record<string, unknown>[]) => {
      const path = `/${resource}/batch`;
      console.log(`[Batch Delete] Calling: ${path}`, { items });
      return api.delete<T[]>(path, { data: { items } });
    },
  };
}

export const listingFeaturesApi = {
  amenities: makeAssoc<ListingAmenityRecord>("listing-amenities"),
  activities: makeAssoc<ListingActivityRecord>("listing-activities"),
  languages: makeAssoc<ListingLanguageRecord>("listing-languages"),
  certifications: makeAssoc<ListingCertificationRecord>(
    "listing-certifications"
  ),
  diningOptions: makeAssoc<ListingDiningOptionRecord>(
    "listing-dining-options"
  ),
  safetyFeatures: makeAssoc<ListingSafetyFeatureRecord>(
    "listing-safety-features"
  ),
  insuranceOptions: makeAssoc<ListingInsuranceOptionRecord>(
    "listing-insurance-options"
  ),
  houseRules: makeAssoc<ListingHouseRuleRecord>("listing-house-rules"),
  equipment: makeAssoc<ListingEquipmentRecord>("listing-equipment"),
  services: makeAssoc<ListingServiceRecord>("listing-services"),
};




