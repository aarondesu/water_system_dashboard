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
import type { Invoice, Subscriber } from "~/types";
import DataTableNavigation from "../data-table-navigation";
import { Checkbox } from "../ui/checkbox";
import { cn, formatNumber } from "~/lib/utils";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Pencil, PlusCircle, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";

const columns: ColumnDef<Invoice & { subscriber: Subscriber }>[] = [
  {
    id: "select",
    enableGlobalFilter: false,
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <div className="flex justify-end">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomeRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select All"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
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
    accessorKey: "rate_per_unit",
    header: "Rate",
    cell: ({ row }) => (
      <span>&#8369; {formatNumber(row.original.rate_per_unit)} /m&sup3;</span>
    ),
  },
  {
    accessorKey: "amount_due",
    header: "Amount Due",
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
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to={`/dashboard/meters/edit?id=${1}`}>
              <Pencil />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function InvoicesTable() {
  const isMobile = useIsMobile();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading, isFetching, refetch } = useGetAllInvoiceQuery({
    page_index: pagination.pageIndex,
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
        isLoading={isLoading}
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
            <Button
              size={isMobile ? "icon" : "default"}
              variant="outline"
              asChild
            >
              <Link to="/dashboard/invoices/create">
                <PlusCircle className="w-4 h-4" />
                <span>Create</span>
              </Link>
            </Button>
          </div>
        }
      />
      <DataTableNavigation table={table} isLoading={isLoading || isFetching} />
    </div>
  );
}
