import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type VisibilityState,
  type ColumnDef,
  getSortedRowModel,
  type SortingState,
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
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { toast } from "sonner";
import SubscriberActionDropdown from "../subscriber-action-dropdown";

const columns: ColumnDef<Subscriber>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    size: 30,
    header: ({ table }) => (
      <div className="flex justify-center items-center place-self-center">
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
      <div className="flex justify-center items-center place-self-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select Row"
        />
      </div>
    ),
  },
  {
    accessorKey: "last_name",
    enableHiding: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center gap-2 font-bold"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        {column.getIsSorted() === false ? (
          <ChevronsUpDown />
        ) : column.getIsSorted() === "asc" ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "first_name",
    header: "First Name",
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
    size: 50,
    cell: ({ row }) => <SubscriberActionDropdown id={row.original.id || 0} />,
  },
];

export default function SubscribersTable() {
  const isMobile = useIsMobile();

  const { data, isLoading, isFetching, refetch } = useGetAllSubscribersQuery();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    address: isMobile ? false : true,
    email: false,
    mobile_number: false,
    first_name: isMobile ? true : false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns: columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    initialState: {
      columnVisibility: columnVisibility,
    },
    state: {
      columnVisibility: columnVisibility,
      sorting: sorting,
    },
  });

  return (
    <div className="space-y-3">
      <DataTable
        isLoading={isLoading}
        table={table}
        actions={
          <div className="flex gap-1">
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
              asChild
            >
              <Link to="/dashboard/subscribers/create">
                <Plus />
                {!isMobile && <span>Create</span>}
              </Link>
            </Button>
            <Button
              size={isMobile ? "icon" : "default"}
              disabled={
                isLoading ||
                isFetching ||
                !table.getIsSomeRowsSelected() ||
                true
              }
            >
              <Trash2 />
              {!isMobile && <span>Delete</span>}
            </Button>
          </div>
        }
      />
      <DataTableNavigation table={table} />
    </div>
  );
}
