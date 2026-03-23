import type { ReactNode } from "react";
import type {
  Amenity,
  Activity,
  Certification,
  DiningOption,
  Equipment,
  HouseRule,
  InsuranceOption,
  Language,
  SafetyFeature,
  TreatmentService,
} from "@/types";

export type CatalogKey =
  | "amenities"
  | "activities"
  | "languages"
  | "certifications"
  | "diningOptions"
  | "safetyFeatures"
  | "insuranceOptions"
  | "houseRules"
  | "equipment"
  | "treatmentServices";

export type CatalogItem =
  | Amenity
  | Activity
  | Language
  | Certification
  | DiningOption
  | SafetyFeature
  | InsuranceOption
  | HouseRule
  | Equipment
  | TreatmentService;

export type DetailKind = "category" | "code" | "issuingOrDescription" | "none";

export interface CatalogMeta {
  key: CatalogKey;
  label: string;
  helperText: string;
  icon: ReactNode;
  detailKind: DetailKind;
}

export interface CatalogFormState {
  name: string;
  category: string;
  code: string;
  icon: string;
  description: string;
}

export type TopTabId = "lifestyle" | "safety" | "trustPolicies" | "careEquipment";
