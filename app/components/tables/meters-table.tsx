import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useGetAllMetersQuery } from "~/redux/apis/meterApi";
import type { Meter } from "~/types";
import { DataTable } from "../ui/data-table";
import MeterActionDropdown from "../meter-action-dropdown";
import AssignSubscriberMeter from "../assign-subscriber-meter";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Search,
  Trash2,
} from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Input } from "../ui/input";

const columns: ColumnDef<Meter>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between rounded-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Meter #
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-4 w-4 h-4" />
          ) : (
            <ChevronDown className="ml-4 w-4 h-4" />
          )
        ) : (
          <ChevronsUpDown className="ml-4 w-4 h-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        to={`/dashboard/meters/${row.original.id}`}
        className="font-semibold border-b border-dotted border-b-blue-700"
      >
        {row.original.number}
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "subscriber_id",
    header: "Current Subscriber",
    cell: ({ row }) => (
      <AssignSubscriberMeter
        id={row.original.id || 0}
        subscriber_id={row.original.subscriber_id || 0}
      />
    ),
  },
  {
    accessorKey: "status",
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        {column.getIsSorted() ? (
          column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-4 w-4 h-4" />
          ) : (
            <ChevronDown className="ml-4 w-4 h-4" />
          )
        ) : (
          <ChevronsUpDown className="ml-4 w-4 h-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "destructive"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="relativ">
        <MeterActionDropdown id={row.original.id || 0} row={row} />
      </div>
    ),
  },
];

export default function MetersTable() {
  const { data, isLoading, isFetching, refetch } = useGetAllMetersQuery();
  const isMobile = useIsMobile();

  const [globalFilter, setGlobalFilter] = useState<any>();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex: false,
    manualSorting: true,
    state: {
      sorting: sorting,
      pagination: pagination,
      globalFilter: globalFilter,
    },
  });

  return (
    <div className="space-y-3">
      <DataTable
        disabled={isLoading}
        table={table}
        actions={
          <div className="flex w-full gap-1">
            {table.getFilteredSelectedRowModel().rows.length === 0 ? (
              <div className="w-full">
                <form onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center border p-0 rounded-md">
                    <Search className="mx-2 w-4 h-4 text-muted-foreground " />
                    <Input
                      className="border-transparent shadow-none"
                      placeholder="Filter columns..."
                      value={(globalFilter as string) ?? ""}
                      onChange={(event) =>
                        table.setGlobalFilter(String(event.target.value))
                      }
                    />
                  </div>
                </form>
              </div>
            ) : (
              <Button
                variant="outline"
                disabled={
                  isLoading || isFetching || !table.getIsSomeRowsSelected()
                  // isDeleting
                }
              >
                <Trash2 />
                <span>
                  Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                  rows{" "}
                </span>
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
