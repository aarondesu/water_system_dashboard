import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetAllMetersQuery } from "~/redux/apis/meterApi";
import type { Meter } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import MeterActionDropdown from "../meter-action-dropdown";
import AssignSubscriberMeter from "../assign-subscriber-meter";
import { Button } from "../ui/button";

const columns: ColumnDef<Meter>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox onCheckedChange={(value) => row.toggleSelected(!!value)} />
    ),
  },
  {
    accessorKey: "number",
    header: () => <div className="text-center">Meter #</div>,
    cell: ({ row }) => (
      <div className="flex place-content-center">{row.original.number}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "subscriber_id",
    header: "Current Subscriber",
    cell: ({ row }) => (
      <AssignSubscriberMeter
        id={row.original.id || 0}
        subscriber_id={row.original.subscriber_id || 0}
      />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="relativ">
        <MeterActionDropdown id={row.original.id || 0} />
      </div>
    ),
  },
];

export default function MetersTable() {
  const { data, isLoading } = useGetAllMetersQuery();

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTable isLoading={isLoading} table={table} />
      <DataTableNavigation table={table} />
    </div>
  );
}
