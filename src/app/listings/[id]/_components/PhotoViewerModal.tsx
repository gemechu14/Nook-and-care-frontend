"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { ListingDetail } from "../_types";

interface PhotoViewerModalProps {
  listing: ListingDetail;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function PhotoViewerModal({ listing, index, onClose, onIndexChange }: PhotoViewerModalProps) {
  const { images, title } = listing;
  const len = images.length;

  useEffect(() => {
    if (len === 0) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + len) % len);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % len);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, len, onClose, onIndexChange]);

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between">
          <div className="text-white/80 text-sm font-medium">
            {len > 0 ? `${index + 1} / ${len}` : "0 / 0"}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close viewer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main image */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-10">
          <div className="relative w-full max-w-6xl h-[70vh] sm:h-[78vh]">
            <Image
              src={images[index] ?? images[0]}
              alt={`${title} photo ${index + 1}`}
              fill
              unoptimized
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Prev/Next */}
        {len > 1 && (
          <>
            <button
              type="button"
              onClick={() => onIndexChange((index - 1 + len) % len)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onIndexChange((index + 1) % len)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Thumbnails */}
        {len > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
            <div className="mx-auto max-w-6xl">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => onIndexChange(i)}
                    className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden border transition-colors ${
                      i === index ? "border-white" : "border-white/20 hover:border-white/60"
                    }`}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image src={src} alt="" fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="text-center text-xs text-white/60">Tip: use ← and → keys to navigate</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
