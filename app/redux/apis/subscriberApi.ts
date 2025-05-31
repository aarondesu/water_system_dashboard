import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiError, Subscriber } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const subscriberApi = createApi({
  reducerPath: "subscriberApi",
  tagTypes: ["subscriber", "meter"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}subscribers/`,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(session_token_key);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllSubscribers: builder.query<Subscriber[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Subscriber[] }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["subscriber"],
    }),
    createSubscriber: builder.mutation<void, Subscriber>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["subscriber"],
    }),
    getSubscriber: builder.query<Subscriber, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Subscriber }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["subscriber"],
    }),
    updateSubscriber: builder.mutation<
      void,
      {
        subscriber: Subscriber;
        id: number;
      }
    >({
      query: ({ subscriber, id }) => ({
        url: `/${id}`,
        method: "PUT",
        body: subscriber,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["subscriber"],
    }),
    deleteSubscriber: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["subscriber", "meter"],
    }),
  }),
});

export const {
  useGetAllSubscribersQuery,
  useCreateSubscriberMutation,
  useGetSubscriberQuery,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
} = subscriberApi;
