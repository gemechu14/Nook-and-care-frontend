import { configureStore } from "@reduxjs/toolkit";
import { toursApiRtk } from "./toursApi";
import { listingsApiRtk } from "./listingsApi";

export const store = configureStore({
  reducer: {
    [toursApiRtk.reducerPath]: toursApiRtk.reducer,
    [listingsApiRtk.reducerPath]: listingsApiRtk.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toursApiRtk.middleware, listingsApiRtk.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

