import { api } from "@/lib/axios";
import type { ApiFavorite } from "@/types/listing";

export interface AddFavoriteRequest {
  user_id: string;
  listing_id: string;
}

export const favoritesApi = {
  list: (): Promise<ApiFavorite[]> =>
    api.get<ApiFavorite[]>("/favorites"),

  add: (userId: string, listingId: string): Promise<ApiFavorite> =>
    api.post<ApiFavorite>("/favorites", { user_id: userId, listing_id: listingId }),

  remove: (favoriteId: string): Promise<void> =>
    api.delete<void>(`/favorites/${favoriteId}`),
};






