import { buildUrlParams } from "~/lib/utils";
import type {
  Reading,
  ApiError,
  Meter,
  Subscriber,
  PaginationResults,
  PaginationArgs,
} from "~/types";
import { baseApi } from "./baseApi";

export const readingApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllReadings: builder.query<
      PaginationResults<
        Reading & { meter: Meter & { subscriber: Subscriber } }
      >,
      PaginationArgs & { meter?: string; reading?: string }
    >({
      query: (params) => ({
        url: buildUrlParams("/readings", [
          `page=${params.page_index}`,
          `rows=${params.rows}`,
          params.meter && `meter=${params.meter}`,
          params.reading && `reading=${params.reading}`,
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
      providesTags: ["readings"],
    }),
    createReading: builder.mutation<void, Reading>({
      query: (data) => ({
        url: "/readings",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["readings", "meters"],
    }),
    deleteReading: builder.mutation<void, number>({
      query: (id) => ({
        url: `/readings/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["readings", "meters"],
    }),
  }),
});

export const {
  useGetAllReadingsQuery,
  useCreateReadingMutation,
  useDeleteReadingMutation,
} = readingApi;
