import { baseApi } from "./baseApi";
import type {
  ApiError,
  Formula,
  FormulaTableColumn,
  FormulaVariable,
} from "~/types";

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
      transformErrorResponse: (response: ApiError) => response,
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
      transformErrorResponse: (response: ApiError) => response,
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
      transformErrorResponse: (response: ApiError) => response,
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
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["formulas"],
    }),
    deleteFormula: builder.mutation<void, number>({
      query: (id) => ({
        url: `/formulas/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["formulas"],
    }),
    bulkDeleteFormula: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: "/formulas",
        method: "DELETE",
        body: {
          ids: ids,
        },
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["formulas"],
    }),
  }),
});
export const {
  useGetAllFormulasQuery,
  useCreateFormulaMutation,
  useDeleteFormulaMutation,
  useBulkDeleteFormulaMutation,
  useGetFormulaQuery,
  useUpdateFormulaMutation,
  usePrefetch,
} = formulaApi;
