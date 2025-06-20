import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetAllMetersQuery } from "~/redux/apis/meterApi";
import type { Meter } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import MeterActionDropdown from "../meter-action-dropdown";
import AssignSubscriberMeter from "../assign-subscriber-meter";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  PlusCircle,
  RefreshCcw,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { Link } from "react-router";
import { Badge } from "../ui/badge";
import { useState } from "react";

const columns: ColumnDef<Meter>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    enableGlobalFilter: false,
    header: ({ table }) => (
      <div className="flex justify-end">
        <Checkbox
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomeRowsSelected() && "indeterminate")
          }
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Checkbox
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          checked={row.getIsSelected()}
        />
      </div>
    ),
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <Button
        variant="ghost"
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
        className="flex font-semibold"
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

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sorting,
    },
  });

  return (
    <div className="space-y-3">
      <DataTable
        isLoading={isLoading}
        table={table}
        actions={
          <div className="flex gap-2">
            <Button
              size="icon"
              disabled={isLoading || isFetching}
              onClick={refetch}
            >
              <RefreshCcw
                className={cn(
                  "w-4 h-4",
                  isFetching ? "animate-spin" : "animate-none"
                )}
              />
            </Button>
            <Button
              disabled={isLoading}
              variant="outline"
              size={isMobile ? "icon" : "default"}
              asChild
            >
              <Link to="/dashboard/meters/create">
                <PlusCircle className="w-4 h-4" />
                {!isMobile && <span>Create</span>}
              </Link>
            </Button>
          </div>
        }
      />
      <DataTableNavigation table={table} />
    </div>
  );
}
