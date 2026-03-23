"use client";

import Image from "next/image";
import type { ListingDetail } from "../_types";

interface ListingGalleryProps {
  listing: ListingDetail;
  onViewAllPhotos: () => void;
}

export function ListingGallery({ listing, onViewAllPhotos }: ListingGalleryProps) {
  const { images, title } = listing;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-2 mb-6 sm:mb-8 rounded-xl overflow-hidden h-[300px] sm:h-[400px] md:h-[460px]">
      {/* Main large image */}
      <div className="relative overflow-hidden group rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
        <Image
          src={images[0]}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Right 2×2 grid (desktop) */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 hidden md:grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`relative overflow-hidden group ${i === 2 ? "rounded-tr-xl" : ""}`}>
            <Image
              src={images[i] ?? images[0]}
              alt={`${title} photo ${i + 1}`}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ))}
        <div className="relative overflow-hidden group rounded-br-xl bg-slate-800">
          {images[4] && (
            <Image
              src={images[4]}
              alt={`${title} photo 5`}
              fill
              unoptimized
              className="object-cover opacity-60 transition-transform duration-300 group-hover:scale-110"
            />
          )}
          <button
            type="button"
            onClick={onViewAllPhotos}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <span className="text-sm font-semibold">All Photos ({images.length})</span>
          </button>
        </div>
      </div>

      {/* Mobile: View All Photos button */}
      <div className="md:hidden mt-2">
        <button
          type="button"
          onClick={onViewAllPhotos}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          View All Photos ({images.length})
        </button>
      </div>
    </div>
  );
}
