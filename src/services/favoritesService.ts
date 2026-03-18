import { api } from "@/lib/axios";
import type { ApiFavorite } from "@/types/listing";
import type { ApiListing } from "@/types/listing";

export interface AddFavoriteRequest {
  user_id: string;
  listing_id: string;
}

export type FavoritesListingsResponse =
  | ApiListing[]
  | {
      items?: ApiListing[];
      results?: ApiListing[];
      data?: ApiListing[];
      total?: number;
      page?: number;
      size?: number;
      pages?: number;
      next_page?: number | null;
      prev_page?: number | null;
    };

export const favoritesApi = {
  list: (): Promise<ApiFavorite[]> =>
    api.get<ApiFavorite[]>("/favorites"),

  add: (userId: string, listingId: string): Promise<ApiFavorite> =>
    api.post<ApiFavorite>("/favorites", { user_id: userId, listing_id: listingId }),

  remove: (favoriteId: string): Promise<void> =>
    api.delete<void>(`/favorites/${favoriteId}`),

  /** Paginated favorites listings for the current user */
  listMyListings: (params?: { page?: number; size?: number }): Promise<FavoritesListingsResponse> => {
    const page = params?.page ?? 1;
    const size = params?.size ?? 20;
    return api.get<FavoritesListingsResponse>(`/favorites/me/listings?page=${page}&size=${size}`);
  },
};






