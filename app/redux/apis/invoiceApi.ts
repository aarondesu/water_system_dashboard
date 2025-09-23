import type {
  Invoice,
  PaginationArgs,
  PaginationResults,
  ApiError,
  Subscriber,
  Meter,
  Formula,
  FormulaVariable,
  FormulaTableColumn,
  Reading,
} from "~/types";
import { baseApi } from "./baseApi";
import { buildUrlParams } from "~/lib/utils";

export const invoiceApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllInvoice: builder.query<
      PaginationResults<Invoice & { subscriber: Subscriber; formula: Formula }>,
      PaginationArgs
    >({
      query: (args) => ({
        url: buildUrlParams("/invoices", [
          `page=${args.page_index}`,
          `rows=${args.rows}`,
        ]),
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: PaginationResults<
          Invoice & { subscriber: Subscriber; formula: Formula }
        >;
      }) => result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["invoices"],
    }),
    getInvoice: builder.query<
      Invoice & {
        subscriber: Subscriber;
        meter: Meter;
        previous_reading: Reading;
        current_reading: Reading;
        formula: Formula & {
          variables: FormulaVariable[];
          columns: FormulaTableColumn[];
        };
      },
      number
    >({
      query: (id) => ({
        url: `/invoices/${id}?populate=*`,
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: Invoice & {
          subscriber: Subscriber;
          meter: Meter;
          previous_reading: Reading;
          current_reading: Reading;
          formula: Formula & {
            variables: FormulaVariable[];
            columns: FormulaTableColumn[];
          };
        };
      }) => result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["invoices"],
    }),
    getArrears: builder.query<Invoice[], { subscriber_id: number }>({
      query: ({ subscriber_id }) => ({
        url: `/invoices/arrears/${subscriber_id}`,
        method: "GET",
      }),
      transformResponse: (result: { success: boolean; data: Invoice[] }) =>
        result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["invoices"],
    }),
    createInvoice: builder.mutation<void, Invoice>({
      query: (data) => ({
        url: "/invoices",
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["invoices"],
    }),
    createMultiipleInvoices: builder.mutation<void, Invoice[]>({
      query: (data) => ({
        url: "/invoices?type=bulk",
        method: "POST",
        body: {
          invoices: data,
        },
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["invoices"],
    }),
    deleteInvoice: builder.mutation<void, number>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["invoices"],
    }),
    bulkDeleteInvoice: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: "/invoices",
        method: "DELETE",
        body: {
          ids: ids,
        },
      }),
      transformErrorResponse: (response: ApiError) => response,
      invalidatesTags: ["invoices"],
    }),
  }),
});

export const {
  useGetAllInvoiceQuery,
  useCreateInvoiceMutation,
  useGetInvoiceQuery,
  useCreateMultiipleInvoicesMutation,
  useGetArrearsQuery,
  useDeleteInvoiceMutation,
  useBulkDeleteInvoiceMutation,
  usePrefetch,
} = invoiceApi;
