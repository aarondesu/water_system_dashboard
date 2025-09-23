import {
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  useBulkDeleteInvoiceMutation,
  useGetAllInvoiceQuery,
} from "~/redux/apis/invoiceApi";
import { DataTable } from "../ui/data-table";
import type {
  ApiError,
  Formula,
  Invoice,
  PaginationResults,
  Subscriber,
} from "~/types";
import { cn, formatNumber } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { PlusCircle, RefreshCcw, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useConfirmationDialog } from "../confirmation-dialog-provider";
import { toast } from "sonner";
import InvoiceActionDropdown from "../invoice-action-dropdown";

const columns: ColumnDef<
  Invoice & { subscriber: Subscriber; formula: Formula }
>[] = [
  {
    id: "select",
    enableGlobalFilter: false,
    enableHiding: false,
    header: ({ table }) => (
      <span className="flex justify-end">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </span>
    ),
    cell: ({ row }) => (
      <span className="flex justify-end">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </span>
    ),
  },
  {
    accessorKey: "invoice_number",
    enableHiding: false,
    header: () => <span className="justify-end">Invoice Number</span>,
    cell: ({ row }) => (
      <span className="font-semibold justify-end bg-blue-100">
        <Link
          to={`/invoice/view/${row.original.id}`}
          className="border-b border-blue-500 border-dotted"
        >
          {row.original.invoice_number}
        </Link>
      </span>
    ),
  },
  {
    accessorKey: "subscriber.last_name",
    header: "Subscriber",
    enableHiding: false,
    cell: ({ row }) => (
      <span>
        {row.original.subscriber.last_name},{" "}
        {row.original.subscriber.first_name}
      </span>
    ),
  },
  {
    accessorKey: "consumption",
    header: "Consumption",
    cell: ({ row }) => (
      <span>{formatNumber(row.original.consumption || 0)} m&sup3;</span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "formula",
    header: "Formula",
    cell: ({ row }) => <span>{row.original.formula.name}</span>,
  },
  {
    accessorKey: "amount_due",
    header: "Amount Due",
    enableHiding: false,
    cell: ({ row }) => (
      <span>&#8369; {formatNumber(row.original?.amount_due || 0)}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Issued At",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={"destructive"}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
  },
  {
    id: "actions",
    enableHiding: false,
    enableGlobalFilter: false,
    enableColumnFilter: false,
    cell: ({ row }) => <InvoiceActionDropdown id={row.original.id ?? 0} />,
  },
];

interface InvoicesTableProps {
  data?: PaginationResults<
    Invoice & { subscriber: Subscriber; formula: Formula }
  >;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export default function InvoicesTable({
  data,
  pagination,
  setPagination,
}: InvoicesTableProps) {
  const isMobile = useIsMobile();
  const { createDialog } = useConfirmationDialog();
  const [bulkDeleteInvoice, results] = useBulkDeleteInvoiceMutation();

  const table = useReactTable({
    columns: columns,
    data: data?.items || [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: pagination,
    },
    initialState: {
      columnVisibility: {
        formula: false,
      },
    },
    pageCount: data?.pages,
  });

  const onBulkDelete = useCallback(() => {
    const invoiceIds = table
      .getFilteredSelectedRowModel()
      .rows.map((invoice) => invoice.original.id as number);

    createDialog({
      title: "Delete Invoices",
      description:
        "Are you sure you want to desdlete the selected invoices? Action is irreversible",
      action: () => {
        toast.promise(bulkDeleteInvoice(invoiceIds).unwrap(), {
          loading: "Deleting invoices...",
          success: "Successfully deleted invoices",
          error: (error) => {
            if ("data" in error) {
              return (error as ApiError).data.errors[0];
            }

            return "Internal Server Error";
          },
        });

        console.log(invoiceIds);
      },
    });
  }, [table]);

  return (
    <div className="space-y-3">
      <DataTable
        table={table}
        actions={
          <div className="flex w-full">
            {table.getFilteredSelectedRowModel().rows.length === 0 ? (
              <Input placeholder="Search Invoices..." />
            ) : (
              <Button
                type="button"
                variant="outline"
                className=""
                onClick={onBulkDelete}
              >
                <Trash2Icon />
                Delete {table.getFilteredSelectedRowModel().rows.length} rows
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
