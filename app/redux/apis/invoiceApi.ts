import type {
  Invoice,
  PaginationArgs,
  PaginationResults,
  ApiError,
  Subscriber,
  Meter,
} from "~/types";
import { baseApi } from "./baseApi";
import { buildUrlParams } from "~/lib/utils";

export const invoiceApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getAllInvoice: builder.query<
      PaginationResults<Invoice & { subscriber: Subscriber }>,
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
        data: PaginationResults<Invoice & { subscriber: Subscriber }>;
      }) => result.data,
      transformErrorResponse: (response: ApiError) => response,
      providesTags: ["invoices"],
    }),
    getInvoice: builder.query<
      Invoice & { subscriber: Subscriber; meter: Meter },
      number
    >({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "GET",
      }),
      transformResponse: (result: {
        success: boolean;
        data: Invoice & { subscriber: Subscriber; meter: Meter };
      }) => result.data,
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
  }),
});

export const {
  useGetAllInvoiceQuery,
  useCreateInvoiceMutation,
  useGetInvoiceQuery,
} = invoiceApi;
