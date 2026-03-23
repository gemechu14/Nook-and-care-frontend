"use client";

import type { CatalogMeta } from "./types";

const iconClass = "h-5 w-5";

const Icons = {
  amenity: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21V8a2 2 0 00-2-2h-3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21V8a2 2 0 012-2h3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l3-3 3 3" />
    </svg>
  ),
  activity: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10h5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14h3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4h6v6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4l-6 6" />
    </svg>
  ),
  language: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M7 9h10M7 13h10M7 17h6" />
    </svg>
  ),
  certification: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
    </svg>
  ),
  dining: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12v7M12 5v14M18 5v7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5h12" />
    </svg>
  ),
  safety: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11V7" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 18H9.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 21h7L20 4l-8 2-8-2 3.5 17z" />
    </svg>
  ),
  insurance: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4h6l-1 4H10L9 4z" />
    </svg>
  ),
  houseRule: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  equipment: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 4h4M12 8H8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16V8a2 2 0 00-2-2h-6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16V8a2 2 0 012-2h6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16h10v4H7v-4z" />
    </svg>
  ),
  treatment: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10h4v4h-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h6" />
    </svg>
  ),
};

export const CATALOG_META: CatalogMeta[] = [
  {
    key: "amenities",
    label: "Amenities",
    helperText: "Features used by listings",
    detailKind: "category",
    icon: Icons.amenity,
  },
  {
    key: "activities",
    label: "Activities",
    helperText: "Programs and activities catalog",
    detailKind: "category",
    icon: Icons.activity,
  },
  {
    key: "languages",
    label: "Languages",
    helperText: "Supported languages for listings",
    detailKind: "code",
    icon: Icons.language,
  },
  {
    key: "certifications",
    label: "Certifications",
    helperText: "Licenses and certifications catalog",
    detailKind: "issuingOrDescription",
    icon: Icons.certification,
  },
  {
    key: "diningOptions",
    label: "Dining Options",
    helperText: "Dining and meal options",
    detailKind: "issuingOrDescription",
    icon: Icons.dining,
  },
  {
    key: "safetyFeatures",
    label: "Safety Features",
    helperText: "Emergency and safety catalog",
    detailKind: "category",
    icon: Icons.safety,
  },
  {
    key: "insuranceOptions",
    label: "Insurance Options",
    helperText: "Coverage and payment options",
    detailKind: "issuingOrDescription",
    icon: Icons.insurance,
  },
  {
    key: "houseRules",
    label: "House Rules",
    helperText: "Policy rules and guidelines",
    detailKind: "category",
    icon: Icons.houseRule,
  },
  {
    key: "equipment",
    label: "Equipment",
    helperText: "Available equipment catalog",
    detailKind: "category",
    icon: Icons.equipment,
  },
  {
    key: "treatmentServices",
    label: "Treatment Services",
    helperText: "Care and treatment services catalog",
    detailKind: "issuingOrDescription",
    icon: Icons.treatment,
  },
];

export function getMetaByKey(): Record<string, CatalogMeta> {
  return Object.fromEntries(CATALOG_META.map((m) => [m.key, m]));
}
