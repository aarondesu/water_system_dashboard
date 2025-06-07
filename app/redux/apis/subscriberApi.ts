import type { ApiError, Subscriber } from "~/types";
import { baseApi } from "./baseApi";

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscribers: builder.query<Subscriber[], void>({
      query: () => ({
        url: "/subscribers",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Subscriber[] }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["subscribers"],
    }),
    createSubscriber: builder.mutation<void, Subscriber>({
      query: (data) => ({
        url: "/subscribers",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["subscribers"],
    }),
    getSubscriber: builder.query<Subscriber, number>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Subscriber }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["subscribers"],
    }),
    updateSubscriber: builder.mutation<
      void,
      {
        subscriber: Subscriber;
        id: number;
      }
    >({
      query: ({ subscriber, id }) => ({
        url: `/subscribers/${id}`,
        method: "PUT",
        body: subscriber,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["subscribers"],
    }),
    deleteSubscriber: builder.mutation<void, number>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["subscribers", "meters"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllSubscribersQuery,
  useCreateSubscriberMutation,
  useGetSubscriberQuery,
  useUpdateSubscriberMutation,
  useDeleteSubscriberMutation,
} = subscriberApi;
