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
