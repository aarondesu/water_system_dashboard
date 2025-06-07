import type { ApiError, LoginDetails, User } from "~/types";

import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<string, LoginDetails>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (result: {
        success: boolean;
        data: { user: any; token: string };
      }) => result.data.token,
      transformErrorResponse: (response: ApiError) => response,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["auth"],
    }),
    user: builder.query<User, void>({
      query: () => ({
        url: "/auth/user",
        method: "GET",
      }),
      transformErrorResponse: (response: ApiError) => response,
      transformResponse: (result: { success: boolean; data: User }) =>
        result.data,
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation, useUserQuery } = authApi;
