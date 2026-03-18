"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ListingCard from "@/components/ui/ListingCard";
import { favoritesApi, type FavoritesListingsResponse } from "@/services/favoritesService";
import { BASE_URL } from "@/constants/config";
import { useAuth } from "@/store/authStore";
import type { ApiListing } from "@/types";

function normalizeFavoritesListingsResponse(resp: FavoritesListingsResponse): {
  items: ApiListing[];
  total?: number;
  page?: number;
  size?: number;
  pages?: number;
  nextPage?: number | null;
} {
  if (Array.isArray(resp)) return { items: resp };
  const items = resp.items ?? resp.results ?? resp.data ?? [];
  return {
    items,
    total: resp.total,
    page: resp.page,
    size: resp.size,
    pages: resp.pages,
    nextPage: resp.next_page ?? null,
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [items, setItems] = useState<ApiListing[]>([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const pageSize = 20;
  const baseUrl = useMemo(() => BASE_URL.replace("/api/v1", ""), []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login?redirect=/favorites");
      return;
    }
    if (user.role !== "FAMILY" && user.role !== "SENIOR") {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const mapListingImages = (listings: ApiListing[]) => {
    return listings.map((listing) => {
      const images = listing.images || [];
      const primaryImage = images.find((img) => img.is_primary) || images[0];

      let imageUrl = "/placeholder-listing.jpg";
      if (primaryImage?.image_url) {
        imageUrl = primaryImage.image_url.startsWith("http") ? primaryImage.image_url : `${baseUrl}${primaryImage.image_url}`;
      }

      return { ...listing, primaryImageUrl: imageUrl };
    });
  };

  const loadPage = async (nextPage: number, mode: "replace" | "append") => {
    const isInitial = mode === "replace";
    setError(null);
    if (isInitial) setInitialLoading(true);
    else setMoreLoading(true);

    try {
      const resp = await favoritesApi.listMyListings({ page: nextPage, size: pageSize });
      const normalized = normalizeFavoritesListingsResponse(resp);
      const newItems = mapListingImages(normalized.items ?? []);

      setItems((prev) => (mode === "append" ? [...prev, ...newItems] : newItems));
      setPage(nextPage);

      if (typeof normalized.pages === "number" && typeof normalized.page === "number") {
        setHasMore(normalized.page < normalized.pages);
      } else if (typeof normalized.total === "number" && typeof normalized.size === "number" && typeof normalized.page === "number") {
        const loaded = normalized.page * normalized.size;
        setHasMore(loaded < normalized.total);
      } else if (typeof normalized.nextPage === "number") {
        setHasMore(true);
      } else {
        setHasMore(newItems.length >= pageSize);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load favorites.");
      if (mode === "replace") setItems([]);
      setHasMore(false);
    } finally {
      if (isInitial) setInitialLoading(false);
      else setMoreLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    if (user.role !== "FAMILY" && user.role !== "SENIOR") return;
    setItems([]);
    setPage(1);
    setHasMore(false);
    void loadPage(1, "replace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user?.id]);

  if (loading || initialLoading) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 sm:px-6 md:px-8 lg:px-[144px] py-5 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Favorites</h1>
              <p className="text-sm text-slate-500 mt-1">My Favorite Listings.</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/search")}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 lg:px-[144px] py-6 md:py-8">
        {error ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
            <p className="text-slate-900 font-semibold mb-1">Couldn’t load favorites</p>
            <p className="text-slate-600 text-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => loadPage(1, "replace")}
              className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-14">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-slate-600 font-medium">No favorites yet</p>
            <p className="text-slate-500 text-sm mt-1">Tap the heart on a community to save it here.</p>
            <button
              type="button"
              onClick={() => router.push("/search")}
              className="mt-5 inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Find communities
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">{items.length} saved {items.length === 1 ? "community" : "communities"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {items.map((listing) => {
                const listingWithImage = { ...listing, image: (listing as any).primaryImageUrl || "/placeholder-listing.jpg" };
                return <ListingCard key={listing.id} listing={listingWithImage} />;
              })}
            </div>

            <div className="pt-8 flex justify-center">
              {hasMore && !moreLoading ? (
                <button
                  type="button"
                  onClick={() => loadPage(page + 1, "append")}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Load more
                </button>
              ) : moreLoading ? (
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading…</span>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

