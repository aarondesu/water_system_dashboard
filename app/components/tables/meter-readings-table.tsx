import type { Meter, Reading } from "~/types";
import DataTableNavigation from "../data-table-navigation";
import { DataTable } from "../ui/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

interface MeterReadingsTableProps {
  data: Reading[];
  isLoading: boolean;
}

const columns: ColumnDef<Reading>[] = [
  {
    id: "empty",
  },
  {
    accessorKey: "reading",
    header: "Reading",
    cell: ({ row }) => <span>{row.original.reading} m&sup3;</span>,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Recorded At",
    enableHiding: false,
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

export default function MeterReadingsTable({
  data,
  isLoading,
}: MeterReadingsTableProps) {
  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTable table={table} isLoading={isLoading} hideColumns={false} />
      <DataTableNavigation table={table} />
    </div>
  );
}
