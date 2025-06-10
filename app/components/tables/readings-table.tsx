import {
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Meter, Reading, Subscriber } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { useGetAllReadingsQuery } from "~/redux/apis/readingApi";
import { DataTable } from "../ui/data-table";
import DataTableNavigation from "../data-table-navigation";
import { CirclePlus, RefreshCcw } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import ReadingActionDropdown from "../reading-action-dropdown";
import { cn, formatNumber } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { Input } from "../ui/input";
import dayjs from "dayjs";

const columns: ColumnDef<
  Reading & { meter: Meter & { subscriber: Subscriber } }
>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <div className="flex justify-end">
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
      <div className="flex justify-end">
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
    header: () => <div className="">Meter #</div>,
    cell: ({ row }) => <div className="">{row.original.meter.number}</div>,
    enableHiding: false,
  },
  {
    id: "date",
    header: "Reading Period",
    cell: ({ row }) => {
      return (
        <span className="flex flex-row gap-2">
          {`${row.original.start_date} ~ ${row.original.end_date}`}
        </span>
      );
    },
  },
  {
    accessorKey: "reading",
    header: "Reading",
    cell: ({ row }) => (
      <span className="">
        {`${formatNumber(row.original.reading)} `} m&sup3;
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: "Recorded At",
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <ReadingActionDropdown id={row.original.id || 0} />,
  },
];

export default function ReadingsTable() {
  const isMobile = useIsMobile();
  const [meter, setMeter] = useState<string>("");
  const [reading, setReading] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching, refetch } = useGetAllReadingsQuery({
    page_index: pagination.pageIndex + 1,
    rows: pagination.pageSize,
    meter: meter,
    reading: reading,
  });

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
    pageCount: data?.pages,
  });

  return (
    <div className="space-y-3">
      <DataTable
        table={table}
        isLoading={isLoading}
        actions={
          <div className="flex flex-row gap-2">
            <Button
              size="icon"
              disabled={isLoading || isFetching}
              onClick={refetch}
            >
              <RefreshCcw
                className={cn(
                  "w-4 h-4",
                  isLoading || isFetching ? "animate-spin" : "animate-none"
                )}
              />
            </Button>
            <Button
              size={isMobile ? "icon" : "default"}
              variant="outline"
              asChild
            >
              <Link to="/dashboard/readings/create">
                <CirclePlus className="w-4 h-4" />
                {!isMobile && <span>Create</span>}
              </Link>
            </Button>
            <form
              onSubmit={(form) => {
                form.preventDefault();
                console.log(form);
              }}
              className="flex flex-row gap-1"
            >
              <Input className="" placeholder="Search meter..." name="meter" />
              <Input
                className=""
                placeholder="Search reading..."
                name="reading"
              />
              <Input type="submit" hidden />
            </form>
          </div>
        }
      />
      <DataTableNavigation table={table} isLoading={isLoading || isFetching} />
    </div>
  );
}
