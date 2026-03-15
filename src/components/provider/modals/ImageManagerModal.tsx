"use client";

import { useState, useEffect } from "react";
import { listingImagesApi } from "@/services/listingImagesService";
import type { ApiListing, ApiListingImage } from "@/types";

interface ImageManagerModalProps {
  listing: ApiListing;
  onClose: () => void;
}

export function ImageManagerModal({ listing, onClose }: ImageManagerModalProps) {
  const [images, setImages] = useState<ApiListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    listingImagesApi.getByListing(listing.id)
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [listing.id]);

  const uploadFile = async (file: File, isPrimary = false) => {
    setUploading(true);
    setUploadError(null);
    try {
      const img = await listingImagesApi.upload(listing.id, file, images.length, isPrimary);
      setImages((prev) => [...prev, img]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f, i) => uploadFile(f, i === 0 && images.length === 0));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    files.forEach((f, i) => uploadFile(f, i === 0 && images.length === 0));
  };

  const removeImage = async (imgId: string) => {
    await listingImagesApi.delete(imgId).catch(() => {});
    setImages((prev) => prev.filter((i) => i.id !== imgId));
  };

  const setPrimary = async (imgId: string) => {
    await listingImagesApi.update(imgId, { is_primary: true }).catch(() => {});
    setImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === imgId })));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Manage Images</h2>
            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{listing.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-colors ${
              dragOver ? "border-teal-400 bg-teal-50" : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {uploading ? "Uploading…" : "Drop images here or click to browse"}
              </p>
              <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WebP, GIF — max 10MB each</p>
            </div>
            <input
              type="file" multiple accept="image/*"
              onChange={handleFileInput} disabled={uploading}
              className="sr-only"
            />
          </label>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{uploadError}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-4">No images yet. Upload some above.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.sort((a, b) => a.display_order - b.display_order).map((img) => {
                const src = listingImagesApi.getImageUrl(img.image_url, img.id);
                return (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    {img.is_primary && (
                      <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Primary</div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.is_primary && (
                        <button onClick={() => setPrimary(img.id)}
                          className="bg-white text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors">
                          Set Primary
                        </button>
                      )}
                      <button onClick={() => removeImage(img.id)}
                        className="bg-red-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

