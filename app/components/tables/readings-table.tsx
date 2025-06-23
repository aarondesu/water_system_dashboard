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
import {
  CirclePlus,
  Droplet,
  Droplets,
  Notebook,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useState } from "react";
import ReadingActionDropdown from "../reading-action-dropdown";
import { cn, formatNumber } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const columns: ColumnDef<
  Reading & { meter: Meter & { subscriber?: Subscriber } }
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
    cell: ({ row }) => (
      <HoverCard>
        <HoverCardTrigger>
          <Link
            to={`/dashboard/readings/view?id=${row.original.id}`}
            className="font-semibold border-b border-dotted"
          >
            {row.original.meter.number}
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="text-sm flex flex-col gap-2">
          <span className="flex items-center font-semibold justify-between">
            Note
            <Notebook className="w-3 h-3" />
          </span>
          <span>{row.original.note ?? "N/A"}</span>
        </HoverCardContent>
      </HoverCard>
    ),
    enableHiding: false,
  },
  {
    id: "date",
    header: "Reading Period",
    cell: ({ row }) => {
      return (
        <span className="flex flex-row gap-2">
          {`${dayjs(row.original.start_date).format("MMMM DD YYYY")} ~ ${dayjs(
            row.original.end_date
          ).format("MMMM DD YYYY")}`}
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
    cell: ({ row }) => dayjs(row.original.created_at).format("MMMM DD YYYY"),
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <ReadingActionDropdown row={row} />,
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
                <CirclePlus />
                Create
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
      <DataTableNavigation table={table} />
    </div>
  );
}
