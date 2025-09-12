import {
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Meter, PaginationResults, Reading, Subscriber } from "~/types";
import { Checkbox } from "../ui/checkbox";
import { useGetAllReadingsQuery } from "~/redux/apis/readingApi";
import { DataTable } from "../ui/data-table";
import { ChevronsUpDown, CirclePlus, Filter, RefreshCcw } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";
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

interface ReadingsTableProps {
  data?: PaginationResults<
    Reading & {
      meter: Meter & {
        subscriber?: Subscriber;
      };
    }
  >;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
}

export default function ReadingsTable({
  pagination,
  setPagination,
  data,
}: ReadingsTableProps) {
  const isMobile = useIsMobile();
  const [meter, setMeter] = useState<string>("");
  const [reading, setReading] = useState<string>("");
  const [date, setDate] = useState<Date>();

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
        // disabled={isLoading}
        actions={
          <Collapsible>
            <div className="flex flex-row gap-2">
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
          </Collapsible>
        }
      />
    </div>
  );
}
