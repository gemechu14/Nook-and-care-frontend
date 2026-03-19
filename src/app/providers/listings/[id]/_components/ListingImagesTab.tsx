"use client";

import { useEffect, useState } from "react";
import { listingImagesApi } from "@/services/listingImagesService";
import type { ApiListing, ApiListingImage } from "@/types";

interface PreviewImage {
  file: File;
  preview: string;
  isPrimary: boolean;
}

interface ListingImagesTabProps {
  listing: ApiListing;
  images: ApiListingImage[];
  onRefresh: () => void;
}

export function ListingImagesTab({ listing, images, onRefresh }: ListingImagesTabProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; alt: string } | null>(
    null,
  );

  const handleFiles = (rawFiles: File[]) => {
    const files = rawFiles.filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    const nextPreviews: PreviewImage[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: false,
    }));
    setPreviewImages((prev) => [...prev, ...nextPreviews]);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    handleFiles(Array.from(event.dataTransfer.files));
  };

  const removePreview = (index: number) => {
    setPreviewImages((prev) => {
      const removed = prev[index];
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const setPreviewPrimary = (index: number) => {
    setPreviewImages((prev) => prev.map((image, i) => ({ ...image, isPrimary: i === index })));
  };

  const cancelPreview = () => {
    previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
    setPreviewImages([]);
    setError(null);
  };

  const uploadAll = async () => {
    if (previewImages.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const startOrder = images.length;
      const files = previewImages.map((item) => item.file);
      const displayOrders = previewImages.map((_, index) => startOrder + index);
      const primaryIndex = previewImages.findIndex((img) => img.isPrimary);
      const isFirstUpload = images.length === 0;
      const primaryIndexForUpload =
        primaryIndex >= 0 ? primaryIndex : isFirstUpload ? 0 : undefined;

      const uploadedImages = await listingImagesApi.uploadBatch(
        listing.id,
        files,
        displayOrders,
        primaryIndexForUpload,
      );

      // If user did not explicitly choose a primary in this upload batch,
      // and this is not the first upload, force new images to non-primary
      // to avoid auto-primary behavior on subsequent uploads.
      if (primaryIndex < 0 && !isFirstUpload && uploadedImages.length > 0) {
        await Promise.all(
          uploadedImages.map((img) =>
            listingImagesApi.update(img.id, { is_primary: false }).catch(() => undefined),
          ),
        );
      }

      previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setPreviewImages([]);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (id: string) => {
    await listingImagesApi.delete(id).catch(() => undefined);
    onRefresh();
  };

  const setPrimary = async (id: string) => {
    setError(null);
    setSettingPrimaryId(id);
    try {
      const previousPrimaryIds = images
        .filter((img) => img.is_primary && img.id !== id)
        .map((img) => img.id);

      if (previousPrimaryIds.length > 0) {
        await Promise.all(
          previousPrimaryIds.map((primaryId) =>
            listingImagesApi.update(primaryId, { is_primary: false }),
          ),
        );
      }

      await listingImagesApi.update(id, { is_primary: true });
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set primary image.");
    } finally {
      setSettingPrimaryId(null);
    }
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [previewImages]);

  return (
    <div className="space-y-5">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors ${
          dragOver
            ? "border-teal-400 bg-teal-50"
            : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
        } ${uploading ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
          <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">
            {uploading ? "Uploading..." : "Drop images here or click to select files"}
          </p>
          <p className="mt-1 text-xs text-slate-500">JPEG, PNG, WebP, GIF, BMP - max 10MB each</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={uploading}
          className="sr-only"
        />
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {previewImages.length > 0 && (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Preview ({previewImages.length} {previewImages.length === 1 ? "image" : "images"})
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelPreview}
                disabled={uploading}
                className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={uploadAll}
                disabled={uploading}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload All"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {previewImages.map((preview, index) => (
              <div key={`${preview.file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100 shadow-sm transition-shadow hover:shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full cursor-pointer object-cover"
                  onClick={() => setFullscreenImage({ src: preview.preview, alt: `Preview ${index + 1}` })}
                />
                {preview.isPrimary && (
                  <div className="absolute left-2 top-2 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                    Primary
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="pointer-events-auto absolute bottom-0 left-0 right-0 space-y-1.5 p-2">
                    {!preview.isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPrimary(index);
                        }}
                        className="w-full rounded-lg bg-white/95 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(index);
                      }}
                      className="w-full rounded-lg bg-red-600/95 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Uploaded Images ({images.length})</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images
              .slice()
              .sort((a, b) => a.display_order - b.display_order)
              .map((img) => {
                const src = listingImagesApi.getImageUrl(img.image_url, img.id);
                return (
                  <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100 shadow-sm transition-shadow hover:shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full cursor-pointer object-cover"
                      onClick={() => setFullscreenImage({ src, alt: `Image ${img.display_order + 1}` })}
                    />
                    {img.is_primary && (
                      <div className="absolute left-2 top-2 z-10 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
                        Primary
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="pointer-events-auto absolute bottom-0 left-0 right-0 space-y-1.5 p-2">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimary(img.id);
                            }}
                            disabled={settingPrimaryId !== null}
                            className="w-full rounded-lg bg-white/95 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {settingPrimaryId === img.id ? "Setting..." : "Set Primary"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(img.id);
                          }}
                          className="w-full rounded-lg bg-red-600/95 px-2 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {images.length === 0 && previewImages.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400">
          No images yet. Upload using the area above.
        </p>
      )}

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative flex h-full w-full max-h-full max-w-7xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenImage.src}
              alt={fullscreenImage.alt}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
