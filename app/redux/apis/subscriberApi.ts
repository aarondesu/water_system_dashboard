import type { ApiError, Meter, Subscriber } from "~/types";
import { baseApi } from "./baseApi";
import { buildUrlParams } from "~/lib/utils";

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscribers: builder.query<
      Subscriber[],
      { order?: "asc" | "desc" | undefined }
    >({
      query: (params) => ({
        url: buildUrlParams("/subscribers", [
          params.order && `order=${params.order}`,
        ]),
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
    getSubscriber: builder.query<Subscriber & { meter: Meter }, number>({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: Subscriber & { meter: Meter };
      }) => result.data,
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
