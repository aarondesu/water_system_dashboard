import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Meter, Reading } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { useGetAllReadingsQuery } from "~/redux/apis/readingApi";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";

const columns: ColumnDef<Reading>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    size: 20,
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
    accessorKey: "meter.number",
    header: "Meter #",
    size: 30,
    cell: ({ row }) => (
      <div className="text-center">{row.original.meter?.number}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "reading",
    header: "Current Reading",
    enableHiding: false,
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
