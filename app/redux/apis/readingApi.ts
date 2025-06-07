import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildUrlParams } from "~/lib/utils";
import type {
  Reading,
  ApiError,
  Meter,
  Subscriber,
  PaginationResults,
  PaginationArgs,
} from "~/types";

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
      PaginationResults<
        Reading & { meter: Meter & { subscriber: Subscriber } }
      >,
      PaginationArgs & { meter?: string }
    >({
      query: (params) => ({
        url: buildUrlParams("/", [
          `page=${params.page_index}`,
          `rows=${params.rows}`,
          (params.meter && `meter=${params.meter}`) || "",
        ]),
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: PaginationResults<
          Reading & { meter: Meter & { subscriber: Subscriber } }
        >;
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
    deleteReading: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["reading"],
    }),
  }),
});

export const {
  useGetAllReadingsQuery,
  useCreateReadingMutation,
  useDeleteReadingMutation,
} = readingApi;
