import type { Reading } from "~/types";
import { DataTable } from "../ui/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ChevronsRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface CreateInvoiceReadingsTableProps {
  readings: Reading[];
}

const columns: ColumnDef<Reading>[] = [
  {
    id: "hidden",
    enableHiding: false,
  },
  {
    accessorKey: "reading",
    header: "Reading",
  },
  {
    accessorKey: "created_at",
    header: "Date Recorded",
  },
];

export default function CreateInvoiceReadingsTable({
  readings,
}: CreateInvoiceReadingsTableProps) {
  const table = useReactTable({
    columns: columns,
    data: readings,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTable table={table} disabled={false} hideColumns={false} />
    </div>
  );
}
