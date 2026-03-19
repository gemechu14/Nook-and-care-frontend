import { configureStore } from "@reduxjs/toolkit";
import { toursApiRtk } from "./toursApi";

export const store = configureStore({
  reducer: {
    [toursApiRtk.reducerPath]: toursApiRtk.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toursApiRtk.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

