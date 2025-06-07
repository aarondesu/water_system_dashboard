import type { ApiError, User } from "~/types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllusers: builder.query<User[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: User[] }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["users"],
    }),
    createUser: builder.mutation<void, User>({
      query: (data) => ({
        url: "/users",
        method: "POSt",
        body: data,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["users"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllusersQuery, useCreateUserMutation } = userApi;
