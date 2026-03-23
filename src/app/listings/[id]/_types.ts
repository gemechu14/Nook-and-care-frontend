export type CareTypeBadgeColor = "teal" | "purple" | "blue" | "orange";

export interface ListingDetail {
  id: string;
  title: string;
  address: string;
  careTypes: Array<{ label: string; color: CareTypeBadgeColor }>;
  price: number;
  maxPrice: number;
  rating: number;
  reviewCount: number;
  bedsAvailable: number;
  capacity: number;
  staffRatio: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  established: string;
  images: string[];
  description: string;
  descriptionExtra?: string;
  careServices: string[];
  amenities: string[];
  activities: string[];
  diningOptions: string[];
  safetyFeatures: string[];
  certifications: string[];
  insuranceAccepted: string[];
  treatmentServices: Array<{ name: string; price: number | null }>;
  latitude?: number | null;
  longitude?: number | null;
}

export type DetailTabId = "services" | "reviews" | "location";
