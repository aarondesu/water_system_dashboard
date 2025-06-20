import type { Dashboard, ApiError } from "~/types";
import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getDashboard: builder.query<Dashboard, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Dashboard }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["invoices", "meters", "readings", "subscribers"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
