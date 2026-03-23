import type { CatalogKey } from "./types";

export const PAGE_SIZES = [10, 20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export const ALL_CATALOG_KEYS: CatalogKey[] = [
  "amenities",
  "activities",
  "languages",
  "certifications",
  "diningOptions",
  "safetyFeatures",
  "insuranceOptions",
  "houseRules",
  "equipment",
  "treatmentServices",
];

export const AMENITY_CATEGORIES = ["BASIC", "PREMIUM", "SAFETY", "ACCESSIBILITY"] as const;
export const ACTIVITY_CATEGORIES = ["RECREATIONAL", "SOCIAL", "FITNESS", "EDUCATIONAL"] as const;
export const SAFETY_CATEGORIES = ["EMERGENCY", "FIRE", "ACCESSIBILITY", "MEDICAL"] as const;
export const HOUSE_RULE_CATEGORIES = ["GENERAL", "VISITOR", "PET", "SMOKING", "QUIET_HOURS"] as const;

export const CATALOG_DEFAULT_CATEGORY: Record<CatalogKey, string> = {
  amenities: "BASIC",
  activities: "RECREATIONAL",
  languages: "",
  certifications: "",
  diningOptions: "",
  safetyFeatures: "EMERGENCY",
  insuranceOptions: "",
  houseRules: "GENERAL",
  equipment: "MOBILITY",
  treatmentServices: "",
};

export const SINGULAR_LABELS: Record<CatalogKey, string> = {
  amenities: "Amenity",
  activities: "Activity",
  languages: "Language",
  certifications: "Certification",
  diningOptions: "Dining Option",
  safetyFeatures: "Safety Feature",
  insuranceOptions: "Insurance Option",
  houseRules: "House Rule",
  equipment: "Equipment Item",
  treatmentServices: "Treatment Service",
};

export const TOP_TABS = [
  {
    id: "lifestyle" as const,
    title: "Lifestyle & Daily Living",
    keys: ["amenities", "activities", "languages", "diningOptions"] as const,
  },
  {
    id: "safety" as const,
    title: "Safety",
    keys: ["safetyFeatures"] as const,
  },
  {
    id: "trustPolicies" as const,
    title: "Trust and Policies",
    keys: ["certifications", "insuranceOptions", "houseRules"] as const,
  },
  {
    id: "careEquipment" as const,
    title: "Care & Equipment",
    keys: ["equipment", "treatmentServices"] as const,
  },
];
