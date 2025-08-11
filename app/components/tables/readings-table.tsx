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
import { ChevronsUpDown, CirclePlus, Filter, RefreshCcw } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useState } from "react";
import ReadingActionDropdown from "../reading-action-dropdown";
import { cn, formatNumber } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import { z } from "zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import DateSelector from "../ui/date-selector";
import { Label } from "../ui/label";
import MonthSelector from "../month-selector";
import YearSelector from "../year-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const columns: ColumnDef<
  Reading & { meter: Meter & { subscriber?: Subscriber } }
>[] = [
  // {
  //   id: "select",
  //   enableHiding: false,
  //   enableSorting: false,
  //   header: ({ table }) => (
  //     <div className="flex justify-end">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomeRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select All"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex justify-end">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select Row"
  //       />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "meter.number",
    header: () => <span className="flex justify-end">Meter</span>,
    cell: ({ row }) => (
      <span className="flex font-semibold justify-end">
        {row.original.meter.number}
      </span>
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

const formSchema = z.object({
  meter: z.number(),
  reading: z.number(),
});

export default function ReadingsTable() {
  const isMobile = useIsMobile();
  const [meter, setMeter] = useState<string>("");
  const [reading, setReading] = useState<string>("");
  const [date, setDate] = useState<Date>();
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
    autoResetPageIndex: false,
    state: {
      pagination: pagination,
    },
    pageCount: data?.pages,
  });

  return (
    <div className="space-y-3">
      <DataTable
        table={table}
        disabled={isLoading}
        actions={
          <Collapsible>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size={isMobile ? "icon" : "default"}
                    variant="outline"
                  >
                    <CirclePlus />
                    Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/reading/create"
                      className="flex items-center gap-2"
                    >
                      Single
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard/reading/create/multiple"
                      className="flex items-center gap-2"
                    >
                      Multiple
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <form
                onSubmit={(form) => {
                  form.preventDefault();
                }}
                className="flex flex-row gap-1"
              >
                <Input
                  className=""
                  placeholder="Search meter..."
                  name="meter"
                  type="number"
                  onChange={(value) => setMeter(value.currentTarget.value)}
                />
                <Input
                  className=""
                  placeholder="Search reading..."
                  name="reading"
                  type="number"
                  onChange={(value) => setReading(value.currentTarget.value)}
                />
                <Input type="submit" hidden />
              </form>
              <CollapsibleTrigger className="" asChild>
                <Button className="" variant="ghost">
                  {isMobile ? <Filter /> : "Advanced Filters"}{" "}
                  <ChevronsUpDown className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-2 flex gap-2 align-bottom">
              <div className="space-y-1">
                <Label>Filter Date</Label>
                <div className="flex gap-2">
                  <MonthSelector />
                  <YearSelector />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        }
      />
    </div>
  );
}
