import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type VisibilityState,
  type ColumnDef,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useGetAllSubscribersQuery } from "~/redux/apis/subscriberApi";
import type { Subscriber } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import SubscriberActionDropdown from "../subscriber-action-dropdown";
import { Input } from "../ui/input";

const columns: ColumnDef<Subscriber>[] = [
  {
    id: "select",
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
          aria-label="Select Row"
        />
      </div>
    ),
  },
  {
    id: "full_name",
    accessorFn: (data) => `${data.last_name}, ${data.first_name}`,
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 font-"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        {column.getIsSorted() === false ? (
          <ChevronsUpDown />
        ) : column.getIsSorted() === "asc" ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        to={`/dashboard/subscribers/view/${row.original.id}`}
        className="space-x-2 border-b border-dotted border-b-blue-700 font-semibold"
      >
        <span>{row.original.last_name},</span>
        <span>{row.original.first_name}</span>
      </Link>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "mobile_number",
    header: "Mobile Number",
  },
  {
    id: "actions",
    enableHiding: false,
    enableColumnFilter: false,
    enableMultiSort: false,
    cell: ({ row }) => <SubscriberActionDropdown id={row.original.id || 0} />,
  },
];

export default function SubscribersTable() {
  const isMobile = useIsMobile();

  const { data, isLoading, isFetching, refetch } = useGetAllSubscribersQuery(
    {}
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<any>([]);

  const table = useReactTable({
    columns: columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting: sorting,
      globalFilter: globalFilter,
    },
  });

  return (
    <div className="flex flex-col w-full space-y-3">
      <DataTable
        isLoading={isLoading}
        table={table}
        actions={
          <div className="flex w-full gap-1">
            <Button
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
            >
              <RefreshCcw
                className={cn(
                  "w-15 h-15",
                  isFetching || isLoading ? "animate-spin" : "animate-none"
                )}
              />
            </Button>
            <Button
              size={isMobile ? "icon" : "default"}
              disabled={isLoading}
              variant="outline"
              asChild
            >
              <Link to="/dashboard/subscribers/create">
                <Plus />
                {!isMobile && <span>Create</span>}
              </Link>
            </Button>
            <Button
              size={isMobile ? "icon" : "default"}
              variant="outline"
              disabled={
                isLoading || isFetching || !table.getIsSomeRowsSelected()
              }
            >
              <Trash2 />
              {!isMobile && <span>Delete</span>}
            </Button>
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
          </div>
        }
      />
      <DataTableNavigation table={table} />
    </div>
  );
}
