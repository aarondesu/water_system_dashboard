import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import { utilityApi } from "./apis/utilityApi";
import { userApi } from "./apis/userApi";
import { subscriberApi } from "./apis/subscriberApi";
import { meterApi } from "./apis/meterApi";
import { readingApi } from "./apis/readingApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [utilityApi.reducerPath]: utilityApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [subscriberApi.reducerPath]: subscriberApi.reducer,
    [meterApi.reducerPath]: meterApi.reducer,
    [readingApi.reducerPath]: readingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      utilityApi.middleware,
      userApi.middleware,
      subscriberApi.middleware,
      meterApi.middleware,
      readingApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
