// ─── Listing types ────────────────────────────────────────────────────────────

export type ListingStatus = "PENDING" | "ACTIVE" | "INACTIVE";

export type ApiCareType =
  | "ASSISTED_LIVING"
  | "MEMORY_CARE"
  | "INDEPENDENT_LIVING"
  | "ADULT_FAMILY_HOME"
  | "SKILLED_NURSING";

export type ApiRoomType = "PRIVATE" | "SEMI_PRIVATE" | "SHARED";

export interface ApiListing {
  id: string;
  provider_id: string;
  title: string;
  description: string | null;
  care_type: ApiCareType;
  room_type: ApiRoomType;
  city: string | null;
  state: string | null;
  country?: string | null;
  postal_code?: string | null;
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price: number | null;
  currency?: string | null;
  capacity: number | null;
  available_beds: number | null;
  staff_ratio?: string | null;
  established_year?: number | null;
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
  images?: ApiListingImage[]; // Images array included in listing response
  amenities?: Array<{
    id: string;
    amenity: Amenity;
    created_at: string;
  }>;
  languages?: Array<{
    id: string;
    language: Language;
    created_at: string;
  }>;
  certifications?: Array<{
    id: string;
    certification: Certification;
    license_number: string | null;
    created_at: string;
  }>;
  activities?: Array<{
    id: string;
    activity: Activity;
    created_at: string;
  }>;
  dining_options?: Array<{
    id: string;
    dining_option: DiningOption;
    created_at: string;
  }>;
  safety_features?: Array<{
    id: string;
    safety_feature: SafetyFeature;
    created_at: string;
  }>;
  insurance_options?: Array<{
    id: string;
    insurance_option: InsuranceOption;
    created_at: string;
  }>;
  house_rules?: Array<{
    id: string;
    house_rule: HouseRule;
    display_order: number;
    created_at: string;
  }>;
  equipment?: Array<{
    id: string;
    equipment: Equipment;
    quantity?: number | null;
    created_at: string;
  }>;
  services?: Array<{
    id: string;
    treatment_service: TreatmentService;
    price: number | null;
    is_included: boolean;
    created_at: string;
  }>;
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

// ─── Tour types ───────────────────────────────────────────────────────────────

export type TourStatus =
  | "PENDING"
  | "APPROVED"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";
export type TourType = "IN_PERSON" | "VIRTUAL";

export interface ApiTour {
  id: string;
  listing_id: string;
  user_id: string;
  tour_type: TourType;
  scheduled_at: string;
  status: TourStatus;
  notes: string | null;
  booked_by_user_id?: string;
  booked_by?: {
    id: string;
    full_name: string;
    phone: string | null;
    email: string | null;
  };
  created_at: string;
  updated_at: string;
  // Extended fields returned by some API responses
  family_name?: string;
  preferred_date?: string;
  family_email?: string;
  family_phone?: string;
}

// ─── Review types ─────────────────────────────────────────────────────────────

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

// ─── Favorite & Report types ──────────────────────────────────────────────────

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
  report_type:
    | "FAKE_LISTING"
    | "SCAM_PROVIDER"
    | "MISLEADING_IMAGES"
    | "FRAUD"
    | "OTHER";
  description: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED";
  created_at: string;
  updated_at: string;
}

// ─── Catalog types ────────────────────────────────────────────────────────────

export interface Amenity {
  id: string;
  name: string;
  category: string | null;
  icon?: string | null;
  created_at?: string;
}
export interface Activity {
  id: string;
  name: string;
  category: string | null;
  description?: string | null;
  created_at?: string;
}
export interface Language {
  id: string;
  name: string;
  code: string | null;
  created_at?: string;
}
export interface Certification {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
}
export interface DiningOption {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
}
export interface SafetyFeature {
  id: string;
  name: string;
  category: string | null;
  description?: string | null;
  created_at?: string;
}
export interface InsuranceOption {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
}
export interface HouseRule {
  id: string;
  name: string;
  category: string | null;
  description?: string | null;
  created_at?: string;
}
export interface Equipment {
  id: string;
  name: string;
  category: string | null;
  description?: string | null;
  created_at?: string;
}
export interface TreatmentService {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateListingRequest {
  provider_id: string;
  title: string;
  description?: string;
  care_type: ApiCareType;
  room_type: ApiRoomType;
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

export type UpdateListingRequest = Partial<CreateListingRequest> & {
  is_featured?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  postal_code?: string | null;
  currency?: string | null;
  available_beds?: number | null;
  staff_ratio?: string | null;
};

// ─── Care type label/color maps ───────────────────────────────────────────────

export type CareTypeBadgeColor = "teal" | "purple" | "blue" | "orange";

export const CARE_TYPE_LABELS: Record<ApiCareType, string> = {
  ASSISTED_LIVING: "Assisted Living",
  MEMORY_CARE: "Memory Care",
  INDEPENDENT_LIVING: "Independent Living",
  ADULT_FAMILY_HOME: "Adult Family Home",
  SKILLED_NURSING: "Skilled Nursing",
};

export const CARE_TYPE_COLORS: Record<ApiCareType, CareTypeBadgeColor> = {
  ASSISTED_LIVING: "teal",
  MEMORY_CARE: "purple",
  INDEPENDENT_LIVING: "blue",
  ADULT_FAMILY_HOME: "orange",
  SKILLED_NURSING: "orange",
};

