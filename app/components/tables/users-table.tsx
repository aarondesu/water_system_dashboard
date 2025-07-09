import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { ApiError, User } from "~/types";
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
import {
  useDeleteUserMutation,
  useGetAllusersQuery,
} from "~/redux/apis/userApi";
import { useIsMobile } from "~/hooks/use-mobile";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import { Link } from "react-router";
import { isValidElement, useMemo, useState } from "react";
import { toast } from "sonner";
import { resolvePromises } from "~/lib/utils";

export default function UsersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading, isFetching, refetch } = useGetAllusersQuery();
  const [deleteUser, deleteUserResults] = useDeleteUserMutation();
  const isMobile = useIsMobile();
  const [isDeleting, setDeleting] = useState<boolean>(false);

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        id: "select",
        enableHiding: false,
        enableSorting: false,
        header: ({ table }) => (
          <div className="flex justify-end items-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomeRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select All"
              disabled={isLoading || isFetching || isDeleting}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end items-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select Row"
              disabled={isLoading || isFetching || isDeleting}
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
        cell: ({ row }) => (
          <div className="w-full font-semibold">{row.original.username}</div>
        ),
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="flex items-center gap-2 font-bold"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-bold">
                Actions
              </DropdownMenuLabel>
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
    ],
    []
  );

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

  const onDeleteButtonPressed = () => {
    const tasks: (() => Promise<any>)[] = [];
    const usersToDelete = table.getFilteredSelectedRowModel().rows;
    setDeleting(true);

    usersToDelete.map((user) => {
      tasks.push(() => {
        user.toggleSelected();
        return deleteUser(user.original.id || 0).unwrap();
      });
    });

    toast.promise(resolvePromises(tasks), {
      loading: "Deleting selected users...",
      success: () => {
        setDeleting(false);
        refetch();
        return "Successfully deleted user";
      },
    });
  };

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
              variant="outline"
              size={isMobile ? "icon" : "default"}
            >
              <Link to="/dashboard/user/create">
                <Plus />
                {!isMobile && <span>Create</span>}
              </Link>
            </Button>
            <Button
              variant="outline"
              disabled={
                isLoading ||
                isFetching ||
                !table.getIsSomeRowsSelected() ||
                isDeleting
              }
              size={isMobile ? "icon" : "default"}
              onClick={onDeleteButtonPressed}
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
