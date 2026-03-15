import { api } from "@/lib/axios";
import { tokenStorage } from "@/lib/tokenStorage";
import { BASE_URL } from "@/constants/config";
import type { ApiListingImage } from "@/types/listing";

export interface CreateListingImageRequest {
  listing_id: string;
  image_url?: string;
  display_order?: number;
  is_primary?: boolean;
}

export const listingImagesApi = {
  getAll: (): Promise<ApiListingImage[]> =>
    api.get<ApiListingImage[]>("/listing-images"),

  getByListing: (listingId: string): Promise<ApiListingImage[]> =>
    api.get<ApiListingImage[]>(`/listing-images/listing/${listingId}`),

  getById: (id: string): Promise<ApiListingImage> =>
    api.get<ApiListingImage>(`/listing-images/${id}`),

  /** Returns the URL to display an image directly in <img> tags */
  getDownloadUrl: (imageId: string): string =>
    `${BASE_URL}/listing-images/${imageId}/download`,

  /** Upload a file from the user's device */
  upload: async (
    listingId: string,
    file: File,
    displayOrder = 0,
    isPrimary = false
  ): Promise<ApiListingImage> => {
    const ALLOWED = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];
    if (!ALLOWED.includes(file.type))
      throw new Error(
        "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, BMP"
      );
    if (file.size > 10 * 1024 * 1024)
      throw new Error("File too large. Maximum size: 10MB");

    const formData = new FormData();
    formData.append("listing_id", listingId);
    formData.append("file", file);
    formData.append("display_order", displayOrder.toString());
    formData.append("is_primary", isPrimary.toString());

    const token = tokenStorage.getAccess();
    const res = await fetch(`${BASE_URL}/listing-images/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { detail?: string })?.detail ?? "Failed to upload image");
    }
    return res.json() as Promise<ApiListingImage>;
  },

  /** Create via URL */
  create: (data: CreateListingImageRequest): Promise<ApiListingImage> =>
    api.post<ApiListingImage>("/listing-images", data),

  update: (
    id: string,
    data: Partial<CreateListingImageRequest>
  ): Promise<ApiListingImage> =>
    api.put<ApiListingImage>(`/listing-images/${id}`, data),

  delete: (id: string): Promise<void> =>
    api.delete<void>(`/listing-images/${id}`),
};

