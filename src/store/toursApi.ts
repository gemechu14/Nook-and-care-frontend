import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiTour } from "@/types/listing";
import { BASE_URL } from "@/constants/config";
import { tokenStorage } from "@/lib/tokenStorage";

export interface ToursPageResponse {
  items: ApiTour[];
  page: number;
  size: number;
  total: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export const toursApiRtk = createApi({
  reducerPath: "toursApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = tokenStorage.getAccess();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Tour"],
  endpoints: (builder) => ({
    getTours: builder.query<
      ToursPageResponse,
      { page: number; size: number; status?: string }
    >({
      query: ({ page, size, status }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("size", String(size));
        if (status) params.set("status", status);
        const qs = params.toString();
        return { url: `/tours/${qs ? `?${qs}` : ""}` };
      },
      transformResponse: (response: unknown, meta, arg) => {
        const xTotalCount = meta?.response?.headers.get("x-total-count");
        const headerTotal = toNumber(xTotalCount);

        if (Array.isArray(response)) {
          const hasNextPage = response.length === arg.size;
          const totalPages =
            headerTotal !== null ? Math.max(1, Math.ceil(headerTotal / arg.size)) : null;
          return {
            items: response as ApiTour[],
            page: arg.page,
            size: arg.size,
            total: headerTotal,
            totalPages,
            hasNextPage,
          };
        }

        const obj = response as Record<string, unknown>;
        const rawItems =
          (Array.isArray(obj.items) && obj.items) ||
          (Array.isArray(obj.results) && obj.results) ||
          (Array.isArray(obj.data) && obj.data) ||
          [];

        const total =
          toNumber(obj.total) ??
          toNumber(obj.total_count) ??
          toNumber(obj.count) ??
          headerTotal;

        const currentPage = toNumber(obj.page) ?? arg.page;
        const currentSize = toNumber(obj.size) ?? toNumber(obj.limit) ?? arg.size;
        const totalPages =
          toNumber(obj.total_pages) ??
          toNumber(obj.pages) ??
          (total !== null ? Math.max(1, Math.ceil(total / currentSize)) : null);
        const hasNextPage =
          typeof obj.has_next === "boolean"
            ? obj.has_next
            : totalPages !== null
              ? currentPage < totalPages
              : rawItems.length === currentSize;

        return {
          items: rawItems as ApiTour[],
          page: currentPage,
          size: currentSize,
          total,
          totalPages,
          hasNextPage,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: "Tour" as const, id })),
              { type: "Tour" as const, id: "LIST" },
            ]
          : [{ type: "Tour" as const, id: "LIST" }],
    }),
    approveTour: builder.mutation<ApiTour, string>({
      query: (id) => ({
        url: `/tours/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tour", id },
        { type: "Tour", id: "LIST" },
      ],
    }),
    completeTour: builder.mutation<ApiTour, string>({
      query: (id) => ({
        url: `/tours/${id}/complete`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tour", id },
        { type: "Tour", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetToursQuery,
  useApproveTourMutation,
  useCompleteTourMutation,
} = toursApiRtk;

