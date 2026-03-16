// ─── Re-exports ───────────────────────────────────────────────────────────────

export type { UserRole, ApiUser } from "./user";

export type { ProviderStatus, ApiProvider } from "./provider";

export type {
  ListingStatus,
  ApiCareType,
  ApiListing,
  ApiListingImage,
  TourStatus,
  TourType,
  ApiTour,
  ApiReview,
  ApiFavorite,
  ApiReport,
  Amenity,
  Activity,
  Language,
  Certification,
  DiningOption,
  SafetyFeature,
  InsuranceOption,
  HouseRule,
  Equipment,
  TreatmentService,
  CreateListingRequest,
  UpdateListingRequest,
  CareTypeBadgeColor,
} from "./listing";

export { CARE_TYPE_LABELS, CARE_TYPE_COLORS } from "./listing";

// ─── UI-only types ────────────────────────────────────────────────────────────

export interface CareTypeBadge {
  label: string;
  color: "teal" | "purple" | "blue" | "orange";
}

export interface Listing {
  id: string;
  title: string;
  location: string;
  careTypes: CareTypeBadge[];
  price: number;
  rating: number;
  reviewCount: number;
  bedsAvailable: number;
  image: string;
  verified: boolean;
  description?: string;
  amenities?: string[];
  contact?: string;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  verified: boolean;
}

export type CareType =
  | "assisted-living"
  | "memory-care"
  | "independent-living"
  | "adult-family-home"
  | "skilled-nursing";

export interface SearchFilters {
  location?: string;
  care?: CareType;
  budget?: string;
  minRating?: number;
  amenities?: string[];
}





