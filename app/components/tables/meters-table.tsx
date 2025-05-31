import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetAllMetersQuery } from "~/redux/apis/meterapi";
import type { Meter } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import MeterActionDropdown from "../meter-action-dropdown";
import AssignSubscriberMeter from "../assign-subscriber-meter";
import { Button } from "../ui/button";

const columns: ColumnDef<Meter>[] = [
  {
    accessorKey: "id",
    header: ({ header }) => <div className="text-center">ID</div>,
    cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
    size: 30,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: () => <div className="text-center">Meter #</div>,
    cell: ({ row }) => (
      <div className="flex place-content-center">{row.original.number}</div>
    ),
    size: 40,
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
    size: 40,
    enableHiding: false,
    cell: ({ row }) => <MeterActionDropdown id={row.original.id || 0} />,
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
