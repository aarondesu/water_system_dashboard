import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import DatePicker from "../ui/date-picker";
import { useMemo, useState } from "react";
import type { Meter, Reading } from "~/types";
import { DataTable } from "../ui/data-table";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Table,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const formSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  meters: z.array(z.number()),
  readings: z.array(z.number()),
});

export default function CreateMultipleReadingsForm() {
  const [readings, setReading] = useState<(Reading & { meter?: Meter })[]>([]);

  const addRow = () => {
    setReading([
      ...readings,
      {
        id: readings.length,
        meter_id: 0,
        reading: 0,
        start_date: new Date(),
        end_date: new Date(),
      },
    ]);
  };

  // const deleteRow = (table: Table<Reading & { meter?: Meter }>) => {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meters: [],
      readings: [],
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  const columns: ColumnDef<Reading & { meter?: Meter }>[] = useMemo(
    () => [
      {
        id: "select",
        enableHiding: false,
        header: ({ table }) => (
          <div className="flex justify-end">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
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
        header: "Meter #",
        cell: ({ row }) => {},
      },
      {
        id: "reading",
        header: "Reading",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Input
              className="border-transparent h-8 w-16 text-right"
              type="number"
              onChange={(value) =>
                (readings[row.original.id || 0].reading = Number(
                  value.target.value
                ))
              }
            />
            <span>m&sup3;</span>
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: readings,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-x">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Redaing Period</FormLabel>
                <FormControl>
                  <DatePicker
                    onSelect={(date) => {
                      if (date?.from && date?.to) {
                        form.setValue("start_date", date.from);
                        form.setValue("end_date", date.to);
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3 mt-10">
          <div id="actions" className=""></div>
          <div id="table" className="">
            <DataTable
              table={table}
              isLoading={false}
              hideColumns={false}
              actions={
                <div className="flex gap-1">
                  <Button
                    className="justify-between"
                    onClick={() => {
                      setReading([
                        ...readings,
                        {
                          id: readings.length,
                          end_date: new Date(),
                          start_date: new Date(),
                          meter_id: 0,
                          reading: 0,
                        },
                      ]);
                    }}
                  >
                    Add
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
