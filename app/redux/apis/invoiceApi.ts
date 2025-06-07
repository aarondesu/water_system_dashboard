import type {
  Invoice,
  PaginationArgs,
  PaginationResults,
  ApiError,
  Subscriber,
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
  }),
});

export const { useGetAllInvoiceQuery } = invoiceApi;
