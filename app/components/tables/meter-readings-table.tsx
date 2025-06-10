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
import ReadingActionDropdown from "../reading-action-dropdown";
import { Badge } from "../ui/badge";

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
    cell: ({ row }) => {
      return (
        <span className="flex gap-8">
          {row.original.created_at}
          {row.id === "0" && <Badge>Latest!</Badge>}
        </span>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <ReadingActionDropdown id={row.original.id || 0} />,
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
