import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./ui/button";
import type { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";

interface DataTableNavigationProps<TData> {
  table: Table<TData>;
}

export default function DataTableNavigation<TData>({
  table,
}: DataTableNavigationProps<TData>) {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex grow place-content-center md:place-content-start">
        <span className="flex gap-2 text-sm items-center">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>Rows visible</span>
        </span>
      </div>
      <div className="flex gap-4 place-content-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
        </div>
        <div className="flex flex-row items-center text-sm gap-2">
          <span>Pages</span>
          <Input
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(target) =>
              table.setPageIndex(Number(target.currentTarget.value) - 1)
            }
            className="w-9 text-center border-transparent"
          />
          <span>of</span>
          <span className="space-x-2">{table.getPageCount()}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
