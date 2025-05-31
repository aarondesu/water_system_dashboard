import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Reading, ApiError } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const readingApi = createApi({
  reducerPath: "readingApi",
  tagTypes: ["reading"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}readings/`,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(session_token_key);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllReadings: builder.query<Reading[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Reading[] }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["reading"],
    }),
  }),
});

export const { useGetAllReadingsQuery } = readingApi;
