import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Reading, ApiError, Meter, Subscriber } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const readingApi = createApi({
  reducerPath: "readingApi",
  tagTypes: ["reading", "meter"],
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
    getAllReadings: builder.query<
      (Reading & { meter: Meter & { subscriber: Subscriber } })[],
      void
    >({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: (Reading & { meter: Meter & { subscriber: Subscriber } })[];
      }) => result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["reading"],
    }),
    createReading: builder.mutation<void, Reading>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["reading", "meter"],
    }),
  }),
});

export const { useGetAllReadingsQuery, useCreateReadingMutation } = readingApi;
