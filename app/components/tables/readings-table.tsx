import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Meter, Reading, Subscriber } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { useGetAllReadingsQuery } from "~/redux/apis/readingApi";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router";
import { Button } from "../ui/button";

const columns: ColumnDef<
  Reading & { meter: Meter & { subscriber: Subscriber } }
>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <div className="flex justify-center items-center">
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
      <div className="flex justify-center items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select Row"
        />
      </div>
    ),
  },
  {
    accessorKey: "meter.number",
    header: "Meter #",
    enableHiding: false,
  },
  {
    id: "current_subscriber",
    header: "Current Subscriber",
    cell: ({ row }) => (
      <span className="">
        {`${row.original.meter.subscriber.last_name}, ${row.original.meter.subscriber.first_name}`}
      </span>
    ),
  },
  {
    accessorKey: "reading",
    header: "Current Reading",
    cell: ({ row }) => (
      <span className="">{`${row.original.reading} `} m&sup3;</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Recorded At",
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
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={`/dashboard/readings/edit?id=${row.original.id}`}>
                <Pencil />
                <span>Edit</span>
              </Link>
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

export default function ReadingsTable() {
  const { data, isLoading } = useGetAllReadingsQuery();

  const table = useReactTable({
    columns: columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTable table={table} isLoading={isLoading} />
      <DataTableNavigation table={table} />
    </div>
  );
}
