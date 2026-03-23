import type { ApiListing, ApiListingImage } from "@/types";
import { CARE_TYPE_LABELS, CARE_TYPE_COLORS } from "@/types";
import { listingImagesApi } from "@/services/listingImagesService";
import type { ListingDetail } from "./_types";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80";

export function apiListingToDetail(
  apiListing: ApiListing,
  apiImages: ApiListingImage[] = []
): ListingDetail {
  const images =
    apiListing.images && apiListing.images.length > 0
      ? apiListing.images
          .sort((a, b) => a.display_order - b.display_order)
          .map((img) => listingImagesApi.getImageUrl(img.image_url, img.id))
      : apiImages.length > 0
        ? apiImages
            .sort((a, b) => a.display_order - b.display_order)
            .map((img) => listingImagesApi.getImageUrl(img.image_url, img.id))
        : [PLACEHOLDER_IMAGE];

  const address = [apiListing.address, apiListing.city, apiListing.state, apiListing.postal_code]
    .filter(Boolean)
    .join(", ");

  const price = apiListing.price ?? 0;

  return {
    id: apiListing.id,
    title: apiListing.title,
    address,
    careTypes: [{
      label: CARE_TYPE_LABELS[apiListing.care_type] ?? apiListing.care_type,
      color: (CARE_TYPE_COLORS[apiListing.care_type] ?? "teal") as ListingDetail["careTypes"][0]["color"],
    }],
    price,
    maxPrice: price * 1.2,
    rating: apiListing.avg_rating ?? 0,
    reviewCount: apiListing.review_count,
    bedsAvailable: apiListing.available_beds ?? 0,
    capacity: apiListing.capacity ?? 0,
    staffRatio: apiListing.staff_ratio ?? "—",
    phone: apiListing.phone ?? "",
    email: apiListing.email ?? "",
    website: "",
    licenseNumber: apiListing.license_number ?? "",
    established:
      apiListing.established_year?.toString() ??
      new Date(apiListing.created_at).getFullYear().toString(),
    images,
    description: apiListing.description ?? "",
    careServices: [
      ...(apiListing.has_24_hour_care ? ["24-hour care available"] : []),
      ...(apiListing.services?.filter((s) => s.is_included).map((s) => s.treatment_service.name) ?? []),
    ],
    amenities: apiListing.amenities?.map((a) => a.amenity.name) ?? [],
    activities: apiListing.activities?.map((a) => a.activity.name) ?? [],
    diningOptions: apiListing.dining_options?.map((d) => d.dining_option.name) ?? [],
    safetyFeatures: apiListing.safety_features?.map((s) => s.safety_feature.name) ?? [],
    certifications: apiListing.certifications?.map((c) => c.certification.name) ?? [],
    insuranceAccepted: apiListing.insurance_options?.map((i) => i.insurance_option.name) ?? [],
    treatmentServices:
      apiListing.services?.map((s) => ({
        name: s.treatment_service.name,
        price: s.price ?? null,
      })) ?? [],
    latitude: apiListing.latitude ?? null,
    longitude: apiListing.longitude ?? null,
  };
}
