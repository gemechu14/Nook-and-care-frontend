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

  /** Get full image URL - handles both relative and absolute URLs */
  getImageUrl: (imageUrl: string | null | undefined, imageId?: string): string => {
    if (!imageUrl && !imageId) return "";
    
    // If image_url is provided and is absolute, return as is
    if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
      return imageUrl;
    }
    
    // If image_url is relative (starts with /), prepend base URL without /api/v1
    if (imageUrl && imageUrl.startsWith("/")) {
      const baseUrl = BASE_URL.replace("/api/v1", "");
      return `${baseUrl}${imageUrl}`;
    }
    
    // Fallback to download URL if imageId is provided
    if (imageId) {
      return listingImagesApi.getDownloadUrl(imageId);
    }
    
    return imageUrl || "";
  },

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

  /** Batch upload multiple images using multipart/form-data */
  uploadBatch: async (
    listingId: string,
    files: File[],
    displayOrders?: number[],
    primaryIndex?: number
  ): Promise<ApiListingImage[]> => {
    const ALLOWED = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
    ];

    if (files.length === 0) {
      throw new Error("No files provided");
    }

    // Validate all files
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        throw new Error(
          `Invalid file type: ${file.name}. Allowed: JPEG, PNG, GIF, WebP, BMP`
        );
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`File too large: ${file.name}. Maximum size: 10MB`);
      }
    }

    const formData = new FormData();
    formData.append("listing_id", listingId);
    files.forEach((file) => {
      formData.append("files", file);
    });

    const token = tokenStorage.getAccess();
    const res = await fetch(`${BASE_URL}/listing-images/batch/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { detail?: string })?.detail ?? "Failed to upload images");
    }

    let uploadedImages = (await res.json()) as ApiListingImage[];

    // Update display orders and primary if needed
    if (displayOrders || primaryIndex !== undefined) {
      const updatePromises = uploadedImages.map(async (img, index) => {
        const updates: Partial<CreateListingImageRequest> = {};
        if (displayOrders && displayOrders[index] !== undefined) {
          updates.display_order = displayOrders[index];
        }
        if (primaryIndex === index) {
          updates.is_primary = true;
        }
        if (Object.keys(updates).length > 0) {
          return listingImagesApi.update(img.id, updates).catch(() => img);
        }
        return img;
      });

      uploadedImages = await Promise.all(updatePromises);
    }

    return uploadedImages;
  },

  /** Batch delete multiple images */
  deleteBatch: async (imageIds: string[]): Promise<ApiListingImage[]> => {
    const token = tokenStorage.getAccess();
    const res = await fetch(`${BASE_URL}/listing-images/batch`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        items: imageIds.map((id) => ({ image_id: id })),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { detail?: string })?.detail ?? "Failed to delete images");
    }

    return res.json() as Promise<ApiListingImage[]>;
  },
};




