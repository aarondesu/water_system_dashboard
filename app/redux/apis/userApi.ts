import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "~/types";

const baseUrl = import.meta.env.VITE_API_URL;
const session_token_key = import.meta.env.VITE_TOKEN_KEY;

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["user"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}users/`,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem(session_token_key);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllusers: builder.query<User[], void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: User[] }) =>
        result.data,
      providesTags: ["user"],
    }),
    createUser: builder.mutation<void, User>({
      query: (data) => ({
        url: "/",
        method: "POSt",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useGetAllusersQuery, useCreateUserMutation } = userApi;
