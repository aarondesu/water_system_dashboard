import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiError } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL_BASE;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const utilityApi = createApi({
  reducerPath: "utility",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(session_token_key);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCookies: builder.query<void, void>({
      query: () => ({
        url: "/sanctum/csrf-cookie",
        method: "GET",
      }),
      transformErrorResponse: (response: ApiError) => response,
    }),
    checkServerHealth: builder.query<void, void>({
      query: () => ({
        url: "/api/health",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCookiesQuery,
  useCheckServerHealthQuery,
  useLazyCheckServerHealthQuery,
} = utilityApi;
