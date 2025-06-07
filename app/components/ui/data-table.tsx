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
import { Settings2 } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "./scroll-area";

interface DataTableProps<TData, TValue> {
  isLoading: boolean;
  actions?: React.ReactNode;
  finalRow?: React.ReactNode;
  hideColumns?: boolean;
  table: ReactTable<TData>;
  enableSelectRow?: boolean;
}

export function DataTable<TData, TValue>({
  isLoading,
  actions,
  finalRow,
  hideColumns = true,
  table,
  enableSelectRow = false,
}: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState<boolean>(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const isMobile = useIsMobile();

  return (
    <div className="relative space-y-3 select-none">
      {actions && hideColumns && (
        <div className="flex gap-2">
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
      <Table className="border rounded-md shadow-md">
        <TableHeader className="bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="font-bold" key={header.id}>
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
          {!isLoading && table.getRowModel().rows?.length ? (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                {isLoading ? "Loading data..." : "No records available"}
              </TableCell>
            </TableRow>
          )}
          {finalRow && finalRow}
        </TableBody>
      </Table>
    </div>
  );
}
