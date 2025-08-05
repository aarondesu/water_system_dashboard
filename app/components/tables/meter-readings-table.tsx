import type { Meter, Reading } from "~/types";
import DataTableNavigation from "../data-table-navigation";
import { DataTable } from "../ui/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";
import ReadingActionDropdown from "../reading-action-dropdown";

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
      const current_date = dayjs();
      const created_date = dayjs(row.original.created_at);

      return (
        <span className="flex gap-2">
          {row.original.created_at}
          {row.id === "0" && <Badge>Latest</Badge>}
          {current_date.diff(created_date) > 30 && (
            <Badge variant="secondary">New</Badge>
          )}
        </span>
      );
    },
    enableHiding: false,
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
      <DataTable table={table} disabled={isLoading} hideColumns={false} />
    </div>
  );
}
