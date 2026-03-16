import { api } from "@/lib/axios";
import type { ApiFavorite } from "@/types/listing";

export const favoritesApi = {
  list: (): Promise<ApiFavorite[]> =>
    api.get<ApiFavorite[]>("/favorites"),

  add: (listingId: string): Promise<ApiFavorite> =>
    api.post<ApiFavorite>("/favorites", { listing_id: listingId }),

  remove: (favoriteId: string): Promise<void> =>
    api.delete<void>(`/favorites/${favoriteId}`),
};






