import { baseApi } from "./baseApi";
import type { Formula, FormulaTableColumn, FormulaVariable } from "~/types";

export const formulaApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllFormulas: builder.query<
      (Formula & {
        variables: FormulaVariable[];
        columns: FormulaTableColumn[];
      })[],
      void
    >({
      query: () => ({
        url: "/formulas",
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: (Formula & {
          variables: FormulaVariable[];
          columns: FormulaTableColumn[];
        })[];
      }) => result.data,
      providesTags: ["formulas"],
    }),
    getFormula: builder.query<
      Formula & { variables: FormulaVariable[]; columns: FormulaTableColumn[] },
      number
    >({
      query: (id) => ({
        url: `/formulas/${id}`,
        method: "GET",
      }),
      providesTags: ["formulas"],
      transformResponse: (result: {
        success: boolean;
        data: Formula & {
          variables: FormulaVariable[];
          columns: FormulaTableColumn[];
        };
      }) => result.data,
    }),
    updateFormula: builder.mutation<
      void,
      {
        id: number;
        formula: Formula & {
          variables: FormulaVariable[];
          columns: FormulaTableColumn[];
        };
      }
    >({
      query: (data) => ({
        url: `/formulas/${data.id}`,
        method: "PUT",
        body: data.formula,
      }),
      invalidatesTags: ["formulas"],
    }),
    createFormula: builder.mutation<
      void,
      Partial<Formula> & {
        variables: Partial<FormulaVariable>[];
        columns: Partial<FormulaTableColumn>[];
      }
    >({
      query: (data) => ({
        url: "/formulas",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["formulas"],
    }),
    deleteFormula: builder.mutation<void, number>({
      query: (data) => ({
        url: "/formulas",
        method: "DELETE",
      }),
      invalidatesTags: ["formulas"],
    }),
  }),
});
export const {
  useGetAllFormulasQuery,
  useCreateFormulaMutation,
  useDeleteFormulaMutation,
  useGetFormulaQuery,
  useUpdateFormulaMutation,
  usePrefetch,
} = formulaApi;
