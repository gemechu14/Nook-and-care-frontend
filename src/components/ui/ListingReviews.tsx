"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { reviewsApi, type ReviewsListingResponse } from "@/services/reviewsService";
import type { ApiReview } from "@/types";

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rounded ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function normalizeResponse(resp: ReviewsListingResponse): {
  items: ApiReview[];
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function ListingReviews({ listingId, pageSize = 20 }: { listingId: string; pageSize?: number }) {
  const [items, setItems] = useState<ApiReview[]>([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const canLoadMore = useMemo(() => hasMore && !initialLoading && !moreLoading, [hasMore, initialLoading, moreLoading]);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const isInitial = mode === "replace";
      setError(null);
      if (isInitial) setInitialLoading(true);
      else setMoreLoading(true);

      try {
        const resp = await reviewsApi.listByListing(listingId, { page: nextPage, size: pageSize });
        const normalized = normalizeResponse(resp);
        const newItems = normalized.items ?? [];

        setItems((prev) => (mode === "append" ? [...prev, ...newItems] : newItems));
        setPage(nextPage);

        // Determine if more pages exist (try meta first, fallback to length check)
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
        setError(e instanceof Error ? e.message : "Failed to load reviews.");
        if (mode === "replace") setItems([]);
        setHasMore(false);
      } finally {
        if (isInitial) setInitialLoading(false);
        else setMoreLoading(false);
      }
    },
    [listingId, pageSize]
  );

  useEffect(() => {
    if (!listingId) return;
    setItems([]);
    setPage(1);
    setHasMore(false);
    setInitialLoading(true);
    void fetchPage(1, "replace");
  }, [listingId, fetchPage]);

  if (initialLoading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <p className="text-slate-900 font-semibold mb-1">Couldn’t load reviews</p>
        <p className="text-slate-600 text-sm mb-4">{error}</p>
        <button
          type="button"
          onClick={() => fetchPage(1, "replace")}
          className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-slate-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((r) => (
        <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <StarRating rating={r.rating} />
                <span className="text-sm font-semibold text-slate-900">{r.rating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Posted {formatDate(r.created_at)}</p>
            </div>
          </div>

          {r.comment && <p className="text-sm text-slate-700 leading-relaxed mt-3">{r.comment}</p>}

          {r.provider_response && (
            <div className="mt-4 border-l-4 border-teal-200 bg-teal-50 rounded-r-lg p-4">
              <p className="text-xs font-semibold text-teal-800 mb-1">Provider response</p>
              <p className="text-sm text-teal-900">{r.provider_response}</p>
            </div>
          )}
        </div>
      ))}

      <div className="pt-2 flex justify-center">
        {canLoadMore ? (
          <button
            type="button"
            onClick={() => fetchPage(page + 1, "append")}
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
    </div>
  );
}

