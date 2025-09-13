import {
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { useGetAllInvoiceQuery } from "~/redux/apis/invoiceApi";
import { DataTable } from "../ui/data-table";
import type { Formula, Invoice, Subscriber } from "~/types";
import { cn, formatNumber } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const columns: ColumnDef<
  Invoice & { subscriber: Subscriber; formula: Formula }
>[] = [
  {
    id: "select",
    enableGlobalFilter: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoice_number",
    enableHiding: false,
    header: () => <span className="flex justify-end">Invoice Number</span>,
    cell: ({ row }) => (
      <span className="font-semibold flex justify-end ">
        <Link
          to={`/invoice/view/${row.original.id}`}
          className="border-b border-blue-500 border-dotted"
        >
          {row.original.invoice_number}
        </Link>
      </span>
    ),
  },
  {
    accessorKey: "subscriber.last_name",
    header: "Subscriber",
    enableHiding: false,
    cell: ({ row }) => (
      <span>
        {row.original.subscriber.last_name},{" "}
        {row.original.subscriber.first_name}
      </span>
    ),
  },
  {
    accessorKey: "consumption",
    header: "Consumption",
    cell: ({ row }) => (
      <span>{formatNumber(row.original.consumption || 0)} m&sup3;</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "formula",
    header: "Formula",
    cell: ({ row }) => <span>{row.original.formula.name}</span>,
  },
  {
    accessorKey: "amount_due",
    header: "Amount Due",
    enableHiding: false,
    cell: ({ row }) => (
      <span>&#8369; {formatNumber(row.original?.amount_due || 0)}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Issued At",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={"destructive"}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
  },
];

export default function InvoicesTable() {
  const isMobile = useIsMobile();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isFetching, refetch } = useGetAllInvoiceQuery({
    page_index: pagination.pageIndex + 1,
    rows: pagination.pageSize,
  });

  const table = useReactTable({
    columns: columns,
    data: data?.items || [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: pagination,
    },
    pageCount: data?.pages,
  });

  return (
    <div className="space-y-3">
      <DataTable
        table={table}
        disabled={isLoading}
        actions={
          <div className="flex flex-row gap-1">
            <Button size="icon" onClick={refetch}>
              <RefreshCcw
                className={cn(
                  "w-4 h-4",
                  isLoading || isFetching ? "animate-spin" : "animate-none"
                )}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={isMobile ? "icon" : "default"} variant="outline">
                  <PlusCircle className="w-4 h-4" />
                  {!isMobile && "Create"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link to={`/dashboard/invoice/create`}>Single</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={`/dashboard/invoice/create/multiple`}>
                    Multiple
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
    </div>
  );
}
