import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Meter } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const meterApi = createApi({
  reducerPath: "meterApi",
  tagTypes: ["meter"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}meters/`,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(session_token_key);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllMeters: builder.query<Meter[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Meter[] }) =>
        result.data,
      providesTags: ["meter"],
    }),
    createMeter: builder.mutation<void, Meter>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: {
          subscriber_id: data.subscriber_id,
          number: data.number,
          note: data.note,
        },
      }),
      invalidatesTags: ["meter"],
    }),
    assignMeter: builder.mutation<void, { id: number; subscriber: number }>({
      query: ({ id, subscriber }) => ({
        url: `/assign/${id}/${subscriber}/`,
        method: "PUT",
      }),
      invalidatesTags: ["meter"],
    }),
    deleteMeter: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["meter"],
    }),
  }),
});

export const {
  useGetAllMetersQuery,
  useCreateMeterMutation,
  useAssignMeterMutation,
  useDeleteMeterMutation,
} = meterApi;
