import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type Table as ReactTable,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Settings2,
} from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import type { ColumnMeta } from "~/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface DataTableProps<TData, TValue> {
  disabled: boolean;
  actions?: React.ReactNode;
  finalRow?: React.ReactNode;
  hideColumns?: boolean;
  table: ReactTable<TData>;
  enableSelectRow?: boolean;
  hideNavigation?: boolean;
}

interface DataTableNavigationProps<TData> {
  table: ReactTable<TData>;
  disabled?: boolean;
}

export function DataTableNavigation<TData>({
  table,
  disabled = false,
}: DataTableNavigationProps<TData>) {
  const [page, currentPage] = useState<number>(
    table.getState().pagination.pageIndex
  );

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex grow place-content-center md:place-content-start">
        <span className="text-sm items-center">
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
              {[10, 50, 100, 500, 1000].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
      </div>
      <div className="flex gap-4 place-content-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || disabled}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || disabled}
          >
            <ChevronLeft />
          </Button>
        </div>
        <div className="flex flex-row items-center text-sm gap-2">
          <span>Pages</span>
          <span>{table.getState().pagination.pageIndex + 1}</span>
          <span>of</span>
          <span className="space-x-2">{table.getPageCount()}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || disabled}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || disabled}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DataTable<TData, TValue>({
  disabled = false,
  actions,
  finalRow,
  hideColumns = true,
  table,
  enableSelectRow = false,
  hideNavigation = false,
}: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const isMobile = useIsMobile();

  return (
    <div className="relative space-y-3 select-none">
      {(actions || hideColumns) && (
        <div className="flex gap-2 items-start">
          <div className="flex grow gap-2">{actions && actions}</div>
          <div className="">
            {hideColumns && (
              <DropdownMenu onOpenChange={setOpen} open={open}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size={!isMobile ? "default" : "icon"}
                    className="ml-auto"
                  >
                    <Settings2 className="w-4 h-4" />
                    <span className="hidden md:block">View</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-bold">
                    Toggle Columns
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => {
                            column.toggleVisibility(!!value);
                            setOpen(true);
                          }}
                        >
                          {column.columnDef.header as string}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
      <div className="rounded-md border shadow-md">
        <Table className="">
          <TableHeader className="bg-muted p-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="py-0" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={cn(
                      "font-bold py-0",
                      (header.column.columnDef.meta as ColumnMeta)?.className
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!disabled && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (enableSelectRow) {
                      row.getToggleSelectedHandler();
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="font-bold text-center"
                >
                  {disabled ? "Loading data..." : "No records available"}
                </TableCell>
              </TableRow>
            )}
            {finalRow && finalRow}
          </TableBody>
        </Table>

        {!hideNavigation && (
          <div className="p-2 bg-background relative overflow-auto">
            <DataTableNavigation table={table} />
          </div>
        )}
      </div>
    </div>
  );
}
