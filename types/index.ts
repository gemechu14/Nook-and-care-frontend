// ─── UI types (used in components) ───────────────────────────────────────────

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

// ─── API types ────────────────────────────────────────────────────────────────

export type UserRole = "FAMILY" | "SENIOR" | "PROVIDER" | "ADMIN";

export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export type ListingStatus = "PENDING" | "ACTIVE" | "INACTIVE";
export type ApiCareType =
  | "ASSISTED_LIVING" | "MEMORY_CARE" | "INDEPENDENT_LIVING"
  | "ADULT_FAMILY_HOME" | "SKILLED_NURSING";

export interface ApiListing {
  id: string;
  provider_id: string;
  title: string;
  description: string | null;
  care_type: ApiCareType;
  city: string | null;
  state: string | null;
  address: string | null;
  price: number | null;
  capacity: number | null;
  available_beds: number | null;
  phone: string | null;
  email: string | null;
  license_number: string | null;
  has_24_hour_care: boolean;
  is_featured: boolean;
  status: ListingStatus;
  avg_rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiListingImage {
  id: string;
  listing_id: string;
  image_url: string | null;
  filename: string | null;
  content_type: string | null;
  file_size: number | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export type ProviderStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface ApiProvider {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  tax_id: string | null;
  address: string;
  city: string;
  country: string;
  verification_status: ProviderStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type TourStatus = "PENDING" | "APPROVED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type TourType = "IN_PERSON" | "VIRTUAL";

export interface ApiTour {
  id: string;
  listing_id: string;
  user_id: string;
  tour_type: TourType;
  scheduled_at: string;
  status: TourStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiReview {
  id: string;
  listing_id: string;
  user_id: string;
  tour_id: string | null;
  rating: number;
  comment: string | null;
  provider_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiFavorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

export interface ApiReport {
  id: string;
  user_id: string;
  listing_id: string | null;
  provider_id: string | null;
  report_type: "FAKE_LISTING" | "SCAM_PROVIDER" | "MISLEADING_IMAGES" | "FRAUD" | "OTHER";
  description: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  created_at: string;
  updated_at: string;
}

// ─── Catalog types ────────────────────────────────────────────────────────────

export interface Amenity { id: string; name: string; category: string | null; }
export interface Activity { id: string; name: string; category: string | null; }
export interface Language { id: string; name: string; code: string | null; }
export interface Certification { id: string; name: string; issuing_body: string | null; }
export interface DiningOption { id: string; name: string; }
export interface SafetyFeature { id: string; name: string; category: string | null; }
export interface InsuranceOption { id: string; name: string; type: string | null; }
export interface HouseRule { id: string; name: string; category: string | null; }
export interface Equipment { id: string; name: string; category: string | null; }
export interface TreatmentService { id: string; name: string; category: string | null; }

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateListingRequest {
  title: string;
  description?: string;
  care_type: ApiCareType;
  city?: string;
  state?: string;
  address?: string;
  price?: number;
  capacity?: number;
  phone?: string;
  email?: string;
  license_number?: string;
  has_24_hour_care?: boolean;
}

export type UpdateListingRequest = Partial<CreateListingRequest> & { is_featured?: boolean; };

// ─── Care type labels ─────────────────────────────────────────────────────────

export const CARE_TYPE_LABELS: Record<ApiCareType, string> = {
  ASSISTED_LIVING: "Assisted Living",
  MEMORY_CARE: "Memory Care",
  INDEPENDENT_LIVING: "Independent Living",
  ADULT_FAMILY_HOME: "Adult Family Home",
  SKILLED_NURSING: "Skilled Nursing",
};

export const CARE_TYPE_COLORS: Record<ApiCareType, CareTypeBadge["color"]> = {
  ASSISTED_LIVING: "teal",
  MEMORY_CARE: "purple",
  INDEPENDENT_LIVING: "blue",
  ADULT_FAMILY_HOME: "orange",
  SKILLED_NURSING: "orange",
};
