import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetAllFormulasQuery, usePrefetch } from "~/redux/apis/formulaApi";
import type { Formula } from "~/types";
import { DataTable } from "../ui/data-table";
import { Link } from "react-router";
import { useMemo } from "react";

export default function FormulaTable() {
  const { data, isLoading } = useGetAllFormulasQuery();
  const prefetchFormula = usePrefetch("getFormula");

  const columns: ColumnDef<Formula>[] = useMemo(() => {
    return [
      {
        id: "temp",
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link
            to={`/dashboard/formula/view/${row.original.id}`}
            className="font-medium border-b border-dotted border-blue-500"
            onMouseEnter={() => prefetchFormula(row.original.id)}
          >
            {row.original.name}
          </Link>
        ),
        enableHiding: false,
      },

      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "created_at",
        header: "Created At",
      },
    ] satisfies ColumnDef<Formula>[];
  }, [prefetchFormula]);

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {},
  });

  return (
    <div className="space-y-4">
      <DataTable table={table} />
    </div>
  );
}
