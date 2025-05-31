import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiError, LoginDetails } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["auth"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}auth/`,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(session_token_key);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<string, LoginDetails>({
      query: (data) => ({
        url: "login",
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
        url: "logout",
        method: "POST",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
