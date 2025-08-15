import { baseApi } from "./baseApi";
import type { Formula, FormulaVariable } from "~/types";

export const formulaApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllFormulas: builder.query<
      (Formula & { variables: FormulaVariable[] })[],
      void
    >({
      query: () => ({
        url: "/formulas",
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: (Formula & { variables: FormulaVariable[] })[];
      }) => result.data,
      providesTags: ["formulas"],
    }),
    createFormula: builder.mutation<
      void,
      Formula & { variables: FormulaVariable[] }
    >({
      query: (data) => ({
        url: "/formulas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["formulas"],
    }),
  }),
});
export const { useGetAllFormulasQuery, useCreateFormulaMutation } = formulaApi;
