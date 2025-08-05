import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { formatNumber } from "~/lib/utils";
import type { Meter, Reading, Subscriber } from "~/types";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";

interface GenerateInvoicesTableProps {
  data: (Meter & { subscriber?: Subscriber; readings: Reading[] })[];
  rate_per_unit: number;
}

export function GenerateInvoicesTable({
  data,
  rate_per_unit,
}: GenerateInvoicesTableProps) {
  const columns: ColumnDef<
    Meter & { subscriber?: Subscriber; readings: Reading[] }
  >[] = useMemo(
    () => [
      {
        id: "blank",
        enableHiding: false,
        enableSorting: false,
      },
      {
        id: "full_name",
        header: "Subscriber",
        cell: ({ row }) =>
          `${row.original.subscriber?.last_name}, ${row.original.subscriber?.first_name}`,
      },
      {
        accessorKey: "number",
        header: "Meter Number",
      },
      {
        id: "consumption",
        header: "Consumption",
        cell: ({ row }) => {
          let consumption = 0;
          if (row.original.readings) {
            if (row.original.readings[0]) {
              if (row.original.readings[1]) {
                consumption =
                  row.original.readings[0].reading -
                  row.original.readings[1].reading;
              } else {
                consumption = row.original.readings[0].reading;
              }
            }
          }

          return (
            <span className="text-right">
              {formatNumber(consumption)} m&sup3;
            </span>
          );
        },
      },
      {
        id: "amount_due",
        header: "Amount Due",
        cell: ({ row }) => {
          let consumption = 0;
          if (row.original.readings) {
            if (row.original.readings[0]) {
              if (row.original.readings[1]) {
                consumption =
                  row.original.readings[0].reading -
                  row.original.readings[1].reading;
              } else {
                consumption = row.original.readings[0].reading;
              }
            }
          }

          return (
            <span>&#8369; {formatNumber(consumption * rate_per_unit)}</span>
          );
        },
      },
    ],
    [rate_per_unit]
  );

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTable table={table} disabled={false} hideColumns={false} />
    </div>
  );
}
