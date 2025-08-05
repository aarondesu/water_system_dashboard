import { cn, formatNumber } from "~/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDown, SearchXIcon, XIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useGetLatestReadingsPerMeterQuery } from "~/redux/apis/readingApi";
import { useEffect, useMemo, useState } from "react";
import type { Meter, Reading, Subscriber, Invoice, ApiError } from "~/types";
import { data } from "react-router";
import { DataTable } from "../ui/data-table";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Cell } from "recharts";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import DateSelector from "../ui/date-selector";
import { Input } from "../ui/input";
import { useConfirmationDialog } from "../confirmation-dialog-provider";
import { useCreateMultiipleInvoicesMutation } from "~/redux/apis/invoiceApi";
import { toast } from "sonner";

interface SelectSubscriberInputProps {
  data: (Meter & { subscriber?: Subscriber } & Record<string, any>)[];
  value?: number;
  onChange?: (id: number) => void;
  disabled?: boolean;
  className?: string;
}

const SelectSubscriberInput = ({
  data,
  value: defaultValue = 0,
  onChange = () => null,
  disabled = false,
  className,
}: SelectSubscriberInputProps) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [open, setOpen] = useState<boolean>(false);

  const meter = data.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
          disabled={disabled}
        >
          {value
            ? meter
              ? `${meter?.number} - ${
                  meter.subscriber
                    ? `${meter.subscriber.last_name}, ${meter.subscriber.first_name}`
                    : `Unassigned`
                }`
              : "Select meter..."
            : "Select Meter..."}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder="Select Subscriber..." />
          <CommandEmpty>No subscribers found</CommandEmpty>
          <CommandList>
            {data.length > 0 &&
              data.map((m, index) => {
                const label = `${m.number} - ${m.subscriber?.last_name}, ${m.subscriber?.first_name}`;

                return (
                  <CommandItem
                    key={index}
                    value={label}
                    onSelect={(value) => {
                      onChange(m.id || 0);
                      setValue(m.id || 0);
                      setOpen(false);
                    }}
                  >
                    {label}
                  </CommandItem>
                );
              })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const invoiceSchema = z.object({
  meter_id: z.coerce.number(),
  subscriber_id: z.coerce.number(),
  previous_reading_id: z.coerce.number(),
  current_reading_id: z.coerce.number(),
});

const formSchema = z
  .object({
    rate_per_unit: z.coerce.number().min(1, "Rate Per Unit is required"),
    due_date: z.date(),
    invoices: z.record(z.string(), invoiceSchema),
  })
  .refine(
    (data) => {
      const obj = Object.values(data.invoices);

      return obj.length !== 0;
    },
    {
      message: "Invoices Table must have data on it",
    }
  );

type FormSchema = z.infer<typeof formSchema>;
type InvoiceSchema = z.infer<typeof invoiceSchema>;

export default function CreateMultipleInvoicesForm() {
  const { createDialog } = useConfirmationDialog();
  const latestMeterReadingResults = useGetLatestReadingsPerMeterQuery();
  const [createMultipleInvoices, createMultipleInvoicesResults] =
    useCreateMultiipleInvoicesMutation();
  const [value, setValue] = useState<number>(0);
  const [tableData, setTableData] = useState<
    (Meter & { subscriber?: Subscriber; readings: Reading[] })[]
  >([]);

  const filteredSelect = latestMeterReadingResults.data?.filter(
    (m) => m.subscriber_id !== null && !tableData.includes(m)
  );

  let total_consumption = 0;
  tableData.forEach((meter) => {
    if (meter.readings[1]) {
      if (meter.readings[0]) {
        total_consumption +=
          (meter.readings[0].reading || 0) - (meter.readings[1].reading || 0);
      } else {
        total_consumption += meter.readings[1].reading || 0;
      }
    }
  });

  const defaultValues: FormSchema = {
    due_date: new Date(),
    rate_per_unit: 0,
    invoices: tableData.reduce(
      (acc, row) => {
        acc[row?.id || 0] = {
          meter_id: 0,
          subscriber_id: 0,
          previous_reading_id: 0,
          current_reading_id: 0,
        };

        return acc;
      },
      {} as FormSchema["invoices"]
    ),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = form.handleSubmit((data) => {
    const invoices = Object.values(data.invoices).map((invoice) => {
      const i: Partial<Invoice> = {
        meter_id: invoice.meter_id,
        subscriber_id: invoice.subscriber_id,
        previous_reading_id: invoice.previous_reading_id,
        current_reading_id: invoice.current_reading_id,
        due_date: data.due_date,
        rate_per_unit: data.rate_per_unit,
      };

      return i;
    });

    toast.promise(createMultipleInvoices([...invoices] as Invoice[]).unwrap(), {
      loading: "Creating multiple invoices...",
      success: "Successfully created invoices!",
      error: (error) => {
        console.log((error as ApiError).data);

        return "Error Occurred";
      },
    });
  });

  const onAddSubscriber = () => {
    const selectedMeter = latestMeterReadingResults.data?.find(
      (m) => m.id === value
    );

    if (selectedMeter) {
      setTableData((tableData) => [...tableData, selectedMeter]);
      setValue((value) => 0);

      const invoice: InvoiceSchema = {
        meter_id: selectedMeter.id || 0,
        subscriber_id: selectedMeter.subscriber_id || 0,
        previous_reading_id: selectedMeter.readings[1]
          ? selectedMeter.readings[1].id || 0
          : 0,
        current_reading_id: selectedMeter.readings[0]
          ? selectedMeter.readings[0].id || 0
          : 0,
      };

      form.setValue(`invoices.${selectedMeter.id || 0}`, invoice);
    }
  };

  const onAddAllSubscriber = () => {
    setTableData((tableData) => {
      const newTableData = Array.from(
        new Set([...tableData, ...(filteredSelect || [])])
      );

      // Iterate thru the new table data, then set the values for the array
      newTableData.forEach((meter) => {
        if (meter) {
          const invoice: InvoiceSchema = {
            meter_id: meter.id ?? 0,
            subscriber_id: meter.subscriber_id ?? 0,
            previous_reading_id: meter.readings[1]
              ? (meter.readings[1].id ?? 0)
              : 0,
            current_reading_id: meter.readings[0]
              ? (meter.readings[0].id ?? 0)
              : 0,
          };

          form.setValue(`invoices.${meter.id || 0}`, invoice);
        }
      });

      return newTableData;
    });
  };

  const onDeleteSubscriber = (id: number) => {
    setTableData((tableData) => tableData.filter((m) => m.id !== id));
    const invoices = form.getValues("invoices");

    const udpatedInvoices = { ...invoices };
    delete udpatedInvoices[id];

    form.setValue("invoices", udpatedInvoices);
  };

  const onResetAll = () => {
    createDialog({
      title: "Reset Entries",
      description:
        "Are you sure you want to reset the entries? Action is irreversible",
      action: () => {
        setTableData((tableData) => []);
        form.resetField("invoices");
      },
    });
  };

  const columns: ColumnDef<
    Meter & { subscriber?: Subscriber; readings: Reading[] }
  >[] = useMemo(
    () => [
      {
        accessorKey: "number",
        enableHiding: false,
        header: () => <span className="flex justify-end">Meter</span>,
        cell: ({ row }) => (
          <span className="flex justify-end">{row.original.number}</span>
        ),
        meta: {
          className: "w-[150px]",
        },
      },
      {
        id: "full_name",
        enableHiding: false,
        header: "Subscriber",
        cell: ({ row }) =>
          `${row.original.subscriber?.last_name}, ${row.original.subscriber?.first_name}`,
      },
      {
        id: "previous_reading",
        header: "Previous Reading",
        meta: {
          className: "w-[150px]",
        },
        cell: ({ row }) => (
          <>
            {`${formatNumber(
              row.original.readings[1] ? row.original.readings[1].reading : 0
            )}`}{" "}
            m&sup3;
          </>
        ),
      },
      {
        id: "current_reading",
        header: "Current Reading",
        meta: {
          className: "w-[150px]",
        },
        cell: ({ row }) => (
          <>
            {`${formatNumber(
              row.original.readings[0] ? row.original.readings[0].reading : 0
            )}`}{" "}
            m&sup3;
          </>
        ),
      },
      {
        id: "consumption",
        header: "Consumption",
        meta: {
          className: "w-[150px]",
        },
        enableHiding: true,
        cell: ({ row }) => {
          const previous = row.original.readings[1]
            ? row.original.readings[1].reading
            : 0;
          const current = row.original.readings[0]
            ? row.original.readings[0].reading
            : 0;

          return <>{formatNumber(current - previous)} m&sup3;</>;
        },
      },
      {
        id: "amount_due",
        header: "Amount Due",
        cell: ({ row }) => {
          const previous = row.original.readings[1]
            ? row.original.readings[1].reading
            : 0;
          const current = row.original.readings[0]
            ? row.original.readings[0].reading
            : 0;
          const consumption = current - previous;

          return (
            <>
              &#8369;{" "}
              {formatNumber(consumption * (form.watch("rate_per_unit") ?? 0))}
            </>
          );
        },
      },
      {
        id: "delete",
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            className="p-0"
            size="icon"
            type="button"
            onClick={() => onDeleteSubscriber(row.original.id || 0)}
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
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {},
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-background rounded-md p-4">
          <h5 className="font-semibold text-foreground">Invoice Details</h5>
          <div className="space-y-1 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold text-muted-foreground">
                Total Consumption
              </span>
              <span className="text-right">
                {formatNumber(total_consumption)} m&sup3;
              </span>
            </div>
            <FormField
              control={form.control}
              name="rate_per_unit"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <span className="font-semibold text-muted-foreground">
                    Rate per unit( &#8369;/m&sup3; )
                  </span>
                  <FormControl>
                    <div className="flex items-center justify-end gap-1">
                      <FormMessage />
                      <Input
                        {...field}
                        className={cn(
                          "border-transparent shadow-none text-right w-16 h-8 px-2 hover:bg-input/20",
                          !field.value && field.value < 1 && "bg-input",
                          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        )}
                        min="0"
                        type="number"
                        inputMode="numeric"
                      />
                      <span className="text-sm">&#8369;/m&sup3;</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2 border-t py-2">
              <span className="font-semibold text-muted-foreground">
                Total Amount Due
              </span>
              <span className="text-right">
                &#8369;{" "}
                {formatNumber(
                  total_consumption * form.watch("rate_per_unit") || 0
                )}
              </span>
            </div>
            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="grid grid-cols-2 items-center">
                  <span className="font-bold text-muted-foreground">
                    Due Date
                  </span>
                  <FormControl>
                    <div className="flex items-center justify-end">
                      <FormMessage />
                      <DateSelector
                        {...field}
                        onSelect={(date) => field.onChange(date)}
                        className="border-transparent shadow-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  tableData.length === 0 ||
                  createMultipleInvoicesResults.isLoading
                }
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <DataTable
            table={table}
            disabled={false}
            actions={
              <div className="flex flex-col md:flex-row gap-2">
                <SelectSubscriberInput
                  value={value}
                  onChange={setValue}
                  data={filteredSelect || []}
                  disabled={latestMeterReadingResults.isLoading}
                />
                <Button
                  className=""
                  variant="outline"
                  onClick={onAddSubscriber}
                  disabled={value === 0}
                >
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={onAddAllSubscriber}
                  disabled={
                    tableData.length ===
                      latestMeterReadingResults.data?.length ||
                    latestMeterReadingResults.isLoading
                  }
                >
                  Add All
                </Button>
                <Button
                  variant="outline"
                  onClick={onResetAll}
                  disabled={tableData.length === 0}
                >
                  Reset
                </Button>
              </div>
            }
          />
        </div>
      </form>
    </Form>
  );
}
