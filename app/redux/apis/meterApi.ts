import { type ApiError, type Meter, type Subscriber } from "~/types";
import { baseApi } from "./baseApi";

export const meterApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getMeter: builder.query<Meter, number>({
      query: (id) => ({
        url: `/meters/${id}`,
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Meter }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["meters"],
    }),
    getAllMeters: builder.query<(Meter & { subscriber?: Subscriber })[], void>({
      query: () => ({
        url: "/meters",
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: (Meter & { subscriber?: Subscriber })[];
      }) => result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["meters"],
    }),
    createMeter: builder.mutation<void, Meter>({
      query: (data) => ({
        url: "/meters",
        method: "POST",
        body: {
          subscriber_id: data.subscriber_id,
          number: data.number,
          note: data.note,
        },
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["meters"],
    }),
    updateMeter: builder.mutation<void, Meter>({
      query: (data) => ({
        url: `/meters/${data.id}`,
        method: "PUT",
        body: {
          subscriber_id: data.subscriber_id,
          number: data.number,
          note: data.note,
        },
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["meters"],
    }),
    assignMeter: builder.mutation<void, { id: number; subscriber: number }>({
      query: ({ id, subscriber }) => ({
        url: `/meters/${id}/assign/${subscriber}/`,
        method: "PUT",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["meters", "subscribers"],
    }),
    clearMeter: builder.mutation<void, number>({
      query: (id) => ({
        url: `/meters/clear/${id}`,
        method: "PUT",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["meters", "subscribers"],
    }),
    deleteMeter: builder.mutation<void, number>({
      query: (id) => ({
        url: `/meters/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["meters", "subscribers"],
    }),
    setStatus: builder.mutation<
      void,
      { id: number; status: "active" | "inactive" }
    >({
      query: ({ id, status }) => ({
        url: `/meters/${id}/status/${status}`,
        method: "PUT",
      }),
      transformErrorResponse: (response: ApiError) => response,
    }),
  }),
});

export const {
  useGetAllMetersQuery,
  useCreateMeterMutation,
  useAssignMeterMutation,
  useClearMeterMutation,
  useDeleteMeterMutation,
  useGetMeterQuery,
  useLazyGetMeterQuery,
  useUpdateMeterMutation,
  useSetStatusMutation,
} = meterApi;
