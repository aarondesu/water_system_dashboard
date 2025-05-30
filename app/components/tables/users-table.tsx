import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { User } from "~/types";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import dayjs from "dayjs";
import { useGetAllusersQuery } from "~/redux/apis/userApi";
import { useIsMobile } from "~/hooks/use-mobile";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import { Link } from "react-router";
import { useState } from "react";

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    size: 15,
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
    accessorKey: "username",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-2 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          {column.getIsSorted() === false ? (
            <ChevronsUpDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          )}
        </Button>
      );
    },
    cell: ({ row }) => <div className="w-full">{row.original.username}</div>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-2 font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          {column.getIsSorted() === false ? (
            <ChevronsUpDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.created_at;
      const formatted = dayjs(date).format("MMMM DD YYYY");

      return <div className="flex w-fit">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableColumnFilter: false,
    enableMultiSort: false,
    size: 50,
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Pencil />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function UsersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading, isFetching, refetch } = useGetAllusersQuery();
  const isMobile = useIsMobile();

  const table = useReactTable({
    columns: columns,
    data: data || [],
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
        actions={
          <div className="flex gap-1">
            <Button
              size="icon"
              disabled={isLoading || isFetching}
              onClick={() => refetch()}
            >
              <RefreshCcw
                className={isFetching ? "animate-spin" : "animate-none"}
              />
            </Button>
            <Button
              asChild
              disabled={isLoading || isFetching}
              size={isMobile ? "icon" : "default"}
            >
              <Link to="/dashboard/users/create">
                <Plus />
                {!isMobile && <span>Create</span>}
              </Link>
            </Button>
            <Button
              disabled={
                isLoading || isFetching || !table.getIsSomeRowsSelected()
              }
              size={isMobile ? "icon" : "default"}
            >
              <Trash2 />
              {!isMobile && <span>Delete</span>}
            </Button>
          </div>
        }
        table={table}
        isLoading={isLoading}
      />
      <DataTableNavigation table={table} />
    </div>
  );
}
