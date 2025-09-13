import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useCreateBulkReadingsMutation,
  useGetLatestReadingPerMeterQuery,
} from "~/redux/apis/readingApi";
import type { Meter, Subscriber, Reading, ApiError } from "~/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "../ui/command";
import { ChevronsUpDown, Loader2, XIcon } from "lucide-react";
import { DataTable } from "../ui/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn, formatNumber } from "~/lib/utils";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useConfirmationDialog } from "../confirmation-dialog-provider";
import DateRangePicker from "../ui/date-picker";
import { Label } from "../ui/label";
import type { DateRange } from "react-day-picker";
import { Badge } from "../ui/badge";
import SelectMeterInput from "../select-meter-input";

const rowSchema = z.object({
  reading: z.coerce.number(),
  meter_id: z.coerce.number(),
});

const formSchema = z.object({
  start_date: z.date({ required_error: "Start period is required" }),
  end_date: z.date({ required_error: "End period is required" }),
  readings: z.record(z.string(), rowSchema),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateMultipleReadingsForm() {
  /**
   * Variable Definitiions
   */
  const [tableData, setTableData] = useState<
    (Meter & {
      subscriber?: Subscriber;
      readings: Reading[];
    })[]
  >([]);
  const [meter, setMeter] = useState<number>(0);
  const latestReadingResults = useGetLatestReadingPerMeterQuery();
  const [createBulkReadings, createBulkReadingsResults] =
    useCreateBulkReadingsMutation();
  const { createDialog } = useConfirmationDialog();

  const filteredSelect = useMemo(
    () =>
      latestReadingResults.data?.filter((meter) => !tableData.includes(meter)),
    [latestReadingResults, tableData]
  );

  /**
   * Form definitions
   */
  const defaultValues: FormSchema = useMemo(
    () => ({
      start_date: new Date(),
      end_date: new Date(),
      readings: tableData.reduce(
        (acc, row) => {
          acc[row?.id || 0] = {
            meter_id: 0,
            reading: 0,
          };

          return acc;
        },
        {} as FormSchema["readings"]
      ),
    }),
    [tableData]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  /**
   * Button functions
   */
  const addMeter = useCallback(() => {
    if (meter) {
      const selectedMeter = filteredSelect?.find((m) => m.id === meter);
      if (selectedMeter) {
        setTableData((tableData) => [...tableData, selectedMeter]);
        setMeter(0);
      }
    }
  }, [meter, filteredSelect]);

  const addMeterTest = useCallback(
    (id: number) => {
      const selectedMeter = filteredSelect?.find((m) => m.id === id);
      if (selectedMeter) {
        setTableData((tableData) => [...tableData, selectedMeter]);
      }
    },
    [filteredSelect]
  );

  const addAllmeters = useCallback(() => {
    setTableData((tableData) =>
      Array.from(new Set([...tableData, ...(latestReadingResults.data || [])]))
    );
  }, [tableData, latestReadingResults.data]);

  const deleteRow = useCallback(
    (id: number) => {
      setTableData((tableData) => tableData.filter((m) => m.id !== id));
      const currentMeters = form.getValues("readings");

      const updatedMeters = { ...currentMeters };
      delete updatedMeters[id];

      form.setValue("readings", updatedMeters);
    },
    [tableData, form]
  );

  const resetTable = useCallback(() => {
    createDialog({
      title: "Reset Table",
      description:
        "Are you sure you want to reset the table? Action is irreversible",
      action: () => {
        setTableData((tableData) => []);
        form.resetField("readings");
      },
    });
  }, [form]);

  /**
   * Column definitions
   */
  const columns = useMemo<
    ColumnDef<Meter & { subscriber?: Subscriber; readings: Reading[] }>[]
  >(
    () => [
      {
        accessorKey: "number",
        enableHiding: false,
        header: () => <span className="flex justify-end">Meter</span>,
        cell: ({ row }) => (
          <span className="flex justify-end">{row.original.number}</span>
        ),
      },
      {
        id: "current_subscriber",
        header: "Current Subscriber",
        cell: ({ row }) =>
          row.original.subscriber
            ? `${row.original.subscriber?.last_name || ""}, ${
                row.original.subscriber?.first_name || ""
              }`
            : "Unassigned",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "inactive" ? "destructive" : "default"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: "previous_reading",
        header: "Previous Reading",
        cell: ({ row }) => (
          <span className="w-30">
            {formatNumber(
              row.original.readings[0] ? row.original.readings[0].reading : 0
            )}{" "}
            m&sup3;
          </span>
        ),
      },
      {
        id: "new_reading",
        header: "Current Reading",
        enableHiding: false,
        cell: ({ row }) => {
          form.setValue(
            `readings.${row.original.id}.meter_id`,
            row.original.id || 0
          );

          return (
            <span className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="readings"
                render={({}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="w-30 border shadow-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder=""
                        step="any"
                        type="number"
                        {...form.register(
                          `readings.${row.original.id}.reading`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <span>m&sup3;</span>
            </span>
          );
        },
      },
      {
        id: "consumption",
        header: "Consumption",
        cell: ({ row }) => {
          const previousReading = row.original.readings[0]
            ? row.original.readings[0].reading
            : 0;
          const currentReading = form.watch(
            `readings.${row.original.id}.reading`
          );
          const consumption = currentReading - previousReading;

          return (
            <span className="">{formatNumber(consumption || 0)} m&sup3;</span>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            size="icon"
            variant="ghost"
            className="p-0"
            type="button"
            onClick={() => deleteRow(row.original.id || 0)}
          >
            <XIcon />
          </Button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    columns: columns,
    data: tableData || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onSubmit = form.handleSubmit((data) => {
    // Create array
    const readings = Object.values(data.readings).map(
      (reading) =>
        ({
          reading: reading.reading,
          meter_id: reading.meter_id,
          start_date: data.start_date,
          end_date: data.end_date,
        }) as Reading
    );

    // Submit query
    toast.promise(createBulkReadings(readings).unwrap(), {
      success: () => {
        setTableData((tableData) => []);
        form.reset();
        latestReadingResults.refetch();

        return "Successfully created readings.";
      },
      error: (error) => (error as ApiError).data.errors[0],
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-background rounded-md space-y-4">
          <h5 className="text-foreground font-semibold">Reading details</h5>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Reading Period</Label>
              <DateRangePicker
                disabled={
                  createBulkReadingsResults.isLoading ||
                  latestReadingResults.isLoading
                }
                onChange={(dates) => {
                  form.setValue("start_date", dates?.from || new Date());
                  form.setValue("end_date", dates?.to || new Date());
                }}
                value={
                  {
                    from: form.watch("start_date"),
                    to: form.watch("end_date"),
                  } as DateRange
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <SelectMeterInput
            data={filteredSelect || []}
            disabled={
              latestReadingResults.isLoading ||
              createBulkReadingsResults.isLoading
            }
            onChange={addMeterTest}
            value={meter}
            className="w-full md:w-[300px]"
          />
          <Button onClick={addMeter} disabled={!meter} variant="outline">
            Add
          </Button>
          <Button
            onClick={addAllmeters}
            disabled={
              filteredSelect?.length === 0 ||
              createBulkReadingsResults.isLoading ||
              latestReadingResults.isLoading
            }
            variant="outline"
          >
            Add All
          </Button>
          <Button
            variant="outline"
            disabled={
              tableData.length === 0 ||
              createBulkReadingsResults.isLoading ||
              latestReadingResults.isLoading
            }
            onClick={resetTable}
          >
            Reset
          </Button>
        </div>
        <div className="space-y-4">
          <DataTable table={table} disabled={false} hideColumns={false} />
        </div>
        <div className="flex place-content-end">
          <Button
            type="button"
            onClick={() => {
              createDialog({
                title: "Submit Readings",
                description:
                  "Are you sure you want the submit the current readings?",
                action: () => {
                  onSubmit();
                },
              });
            }}
            disabled={
              tableData.length === 0 || createBulkReadingsResults.isLoading
            }
          >
            {createBulkReadingsResults.isLoading && (
              <Loader2 className="animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
