import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Invoice } from "~/types";
import { DataTable } from "../ui/data-table";
import { formatNumber } from "~/lib/utils";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";

const columns: ColumnDef<Invoice>[] = [
  {
    id: "blank",
    enableHiding: false,
  },
  {
    accessorKey: "invoice_number",
    header: "Invoice Number",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.invoice_number}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date Issued",
    cell: ({ row }) => dayjs(row.original.created_at).format("MMMM DD YYYY"),
  },
  {
    accessorKey: "consumption",
    header: "Consumption",
    cell: ({ row }) => <>{row.original.consumption} m&sup3;</>,
  },
  {
    accessorKey: "rate_per_unit",
    header: "Rate",
    cell: ({ row }) => (
      <>{formatNumber(row.original.rate_per_unit)} &#8369;/m&sup3;</>
    ),
  },
  {
    accessorKey: "amount_due",
    header: "Amount Due",
    cell: ({ row }) => (
      <>&#8369; {formatNumber(row.original.amount_due || 0)}</>
    ),
    enableHiding: false,
  },

  {
    accessorKey: "due_date",
    header: "Due Date",
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "paid" ? "default" : "destructive"}
      >
        {row.original.status}
      </Badge>
    ),
  },
];

interface SubscriberInvoiceTableProps {
  data: Invoice[];
  isLoading: boolean;
}

export default function SubscriberInvoiceTable({
  data,
  isLoading,
}: SubscriberInvoiceTableProps) {
  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTable table={table} disabled={isLoading} hideColumns={false} />
    </div>
  );
}
