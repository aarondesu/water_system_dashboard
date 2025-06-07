import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./apis/baseApi";
import { utilityApi } from "./apis/utilityApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [utilityApi.reducerPath]: utilityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([baseApi.middleware, utilityApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
