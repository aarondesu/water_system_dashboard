import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  useBulkDeleteFormulaMutation,
  useGetAllFormulasQuery,
  usePrefetch,
} from "~/redux/apis/formulaApi";
import type { ApiError, Formula } from "~/types";
import { DataTable } from "../ui/data-table";
import { Link } from "react-router";
import { useCallback, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { SearchIcon, Trash2Icon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useConfirmationDialog } from "../confirmation-dialog-provider";
import FormulaActionDropdown from "../formula-action-dropdown";

export default function FormulaTable() {
  const { createDialog } = useConfirmationDialog();
  const { data, isLoading } = useGetAllFormulasQuery();
  const [bulkDeteFormulas, results] = useBulkDeleteFormulaMutation();

  const prefetchFormula = usePrefetch("getFormula");

  const columns: ColumnDef<Formula>[] = useMemo<ColumnDef<Formula>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex justify-end">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value: boolean) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            />
          </div>
        ),
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
      {
        id: "action",
        meta: "w-[100px]",
        cell: ({ row }) => <FormulaActionDropdown id={row.original.id} />,
      },
    ];
  }, [prefetchFormula]);

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {},
  });

  const deleteFormulas = useCallback(() => {
    const ids = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);

    createDialog({
      title: "Delete formulas",
      description:
        "Are you sure you want to delete the selected formulas? Action is irreversible.",
      action: () => {
        // Display toast info
        toast.promise(bulkDeteFormulas(ids).unwrap(), {
          loading: "Deleting selected formulas",
          success: "Successfully deleted formulas",
          error: (error) => {
            if ("data" in error) {
              return (error as ApiError).data.errors[0];
            }

            return "Internal server error";
          },
        });
      },
    });
  }, [useBulkDeleteFormulaMutation, table]);

  return (
    <div className="space-y-4">
      <DataTable
        table={table}
        actions={
          <div className="w-full">
            {table.getFilteredSelectedRowModel().rows.length === 0 ? (
              <div className="flex items-center border rounded-md shadow-xs">
                <SearchIcon className="mx-3 w-4 h-4" />
                <Input
                  placeholder="Search formulas..."
                  className="border-transparent shadow-none"
                />
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={deleteFormulas}
                disabled={results.isLoading}
              >
                <Trash2Icon />
                {`Delete ${table.getFilteredSelectedRowModel().rows.length} rows`}
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
