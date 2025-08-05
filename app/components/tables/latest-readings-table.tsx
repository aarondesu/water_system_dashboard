import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Meter, Reading } from "~/types";
import { DataTable } from "../ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatNumber } from "~/lib/utils";
import dayjs from "dayjs";

const columns: ColumnDef<Reading & { meter: Meter }>[] = [
  {
    id: "blank",
    enableHiding: false,
  },
  {
    accessorKey: "meter.number",
    header: "Meter",
    cell: ({ row }) => (
      <span className="font-bold">{row.original.meter.number}</span>
    ),
  },
  {
    id: "start_end_date",
    header: "Reading Period",
    cell: ({ row }) =>
      `${dayjs(row.original.start_date).format("MM/DD/YY")} ~ ${dayjs(
        row.original.end_date
      ).format("MM/DD/YY")}`,
  },
  {
    accessorKey: "reading",
    header: "Reading",
    cell: ({ row }) => <>{formatNumber(row.original.reading)} m&sup3;</>,
  },
  {
    accessorKey: "created_at",
    header: "Recorded at",
    cell: ({ row }) => (
      <>{dayjs(row.original.created_at).format("MMMM DD, YYYY")}</>
    ),
  },
];

interface LatestReadingTableProps {
  data: (Reading & { meter: Meter })[];
}

export default function LatestReadingTable({ data }: LatestReadingTableProps) {
  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="grid">
      <DataTable
        table={table}
        disabled={false}
        hideColumns={false}
        hideNavigation={true}
      />
    </div>
  );
}
