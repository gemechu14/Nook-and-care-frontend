import { useEffect, useMemo, useState } from "react";
import { listingsApi } from "@/services/listingService";
import { listingImagesApi } from "@/services/listingImagesService";
import type { ApiListing, ApiListingImage } from "@/types";
import { MOCK_LISTINGS } from "../_fixtures";
import { apiListingToDetail } from "../_mapper";
import type { ListingDetail } from "../_types";

export interface UseListingDetailResult {
  listing: ListingDetail | null;
  isMockListing: boolean;
  pageLoading: boolean;
  pageError: string | null;
}

export function useListingDetail(
  id: string | undefined
): UseListingDetailResult {
  const [apiListing, setApiListing] = useState<ApiListing | null>(null);
  const [apiImages, setApiImages] = useState<ApiListingImage[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    setApiListing(null);
    setApiImages([]);
    setPageError(null);
    setPageLoading(true);

    if (!id) {
      setPageError("Invalid listing ID.");
      setPageLoading(false);
      return;
    }

    if (MOCK_LISTINGS[id]) {
      setPageLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const data = await listingsApi.getById(id);
        if (cancelled) return;
        setApiListing(data);

        if (!data.images || data.images.length === 0) {
          try {
            const imgs = await listingImagesApi.getByListing(id);
            if (!cancelled) setApiImages(imgs);
          } catch {
            if (!cancelled) setApiImages([]);
          }
        } else {
          setApiImages([]);
        }
      } catch (err) {
        if (!cancelled) {
          setPageError(
            err instanceof Error ? err.message : "Community not found."
          );
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const mockEntry = id && MOCK_LISTINGS[id] ? MOCK_LISTINGS[id] : null;

  const listing = useMemo((): ListingDetail | null => {
    if (mockEntry) return mockEntry;
    if (apiListing) return apiListingToDetail(apiListing, apiImages);
    return null;
  }, [mockEntry, apiListing, apiImages]);

  return {
    listing,
    isMockListing: Boolean(mockEntry),
    pageLoading,
    pageError,
  };
}
