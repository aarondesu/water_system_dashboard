import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect, useMemo, useState } from "react";
import SelectSubscriberInput from "../select-subscriber-input";
import { Input } from "../ui/input";
import { useGetSubscriberQuery } from "~/redux/apis/subscriberApi";
import { Button } from "../ui/button";
import SelectReadingInput from "../select-reading-input";
import CreateInvoiceReadingsTable from "../tables/create-invoice-readings-table";
import DateSelector from "../ui/date-selector";
import {
  useCreateInvoiceMutation,
  useGetArrearsQuery,
} from "~/redux/apis/invoiceApi";
import { toast } from "sonner";
import type {
  ApiError,
  Formula,
  FormulaTableColumn,
  FormulaVariable,
  Invoice,
  Reading,
} from "~/types";
import { cn, formatNumber } from "~/lib/utils";
import { Loader2, TriangleAlert } from "lucide-react";
import { useSearchParams } from "react-router";
import SubscriberInvoiceTable from "../tables/subscriber-invoice-table";
import { invoiceSchema } from "~/schemas";
import { useGetAllFormulasQuery } from "~/redux/apis/formulaApi";
import SelectFormulaInput from "../select-formula-input";
import { evaluate } from "mathjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AlertDialog } from "../ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function CreateInvoiceForm() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<boolean>(
    params.get("subscriber_id") ? true : false
  );
  const [subscriber_id, setSubscriber] = useState<number>(
    Number(params.get("subscriber_id"))
  );
  const [createInvoice, invoiceResults] = useCreateInvoiceMutation();

  const [selectedFormula, setSelectedFormula] = useState<
    Formula & { variables: FormulaVariable[]; columns: FormulaTableColumn[] }
  >();

  const { data, isLoading, isFetching, isSuccess, refetch } =
    useGetSubscriberQuery({ id: subscriber_id });

  const { data: formulaData } = useGetAllFormulasQuery();

  const getArrearsQuery = useGetArrearsQuery({
    subscriber_id: subscriber_id,
  });

  const [previousReading, setPreviousReading] = useState<Reading>();
  const [currentReading, setCurrentReading] = useState<Reading | undefined>(
    data?.meter?.readings?.find(
      (r) => r.id === Number(params.get("reading_id"))
    )
  );

  const disableInput =
    !selected || isLoading || isFetching || invoiceResults.isLoading;

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      subscriber_id: 0,
      current_reading_id: Number(params.get("reading_id")) || 0,
    },
  });

  const total_arrears = useMemo(() => {
    if (!getArrearsQuery.data || getArrearsQuery.data.length === 0) return 0;
    // Calculate total arrears from the fetched data
    return Number(
      getArrearsQuery.data.reduce((total, arrear) => {
        return Number(total) + Number(arrear.amount_due ?? 0);
      }, 0)
    );
  }, [getArrearsQuery.data]);

  const total_consumption = useMemo(() => {
    const consumption =
      Number(currentReading?.reading ?? 0) -
      Number(previousReading?.reading ?? 0);

    return consumption ?? 0;
  }, [currentReading, previousReading]);

  const variables = useMemo(() => {
    const v = selectedFormula?.variables.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.name] = item.value;
        return acc;
      },
      {}
    );

    if (v) {
      v.consumption = total_consumption;
    }

    return v;
  }, [selectedFormula, total_consumption]);

  const amount_due = useMemo(() => {
    if (variables && selectedFormula) {
      try {
        const result = evaluate(selectedFormula.expression ?? "", variables);

        return Number(result) ?? 0;
      } catch (error) {
        console.log(error);
        return 0;
      }
    }

    return 0;
  }, [variables, total_arrears]);

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(createInvoice(data as Invoice).unwrap(), {
      loading: "Creating invoice...",
      success: () => {
        // Reset form if successfull
        form.reset({
          subscriber_id: 0,
          meter_id: 0,
          previous_reading_id: 0,
          current_reading_id: 0,
          due_date: data.due_date,
        });

        setCurrentReading(undefined);
        setPreviousReading(undefined);

        setSubscriber(0);
        refetch();

        return "Successfully created invoice";
      },
      error: (error) => {
        if ("data" in error) {
          return (error as ApiError).data.errors[0];
        }
      },
    });
  });

  useEffect(() => {
    if (isSuccess && subscriber_id !== 0) {
      form.reset({
        subscriber_id: data.id,
        meter_id: data.meter?.id,
        previous_reading_id: 0,
        current_reading_id: Number(params.get("reading_id") || 0),
        due_date: form.getValues("due_date"),
      });
    }
  }, [data, isSuccess, subscriber_id]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            {data && !data?.meter && (
              <Alert>
                <TriangleAlert />
                <AlertTitle>Head's Up</AlertTitle>
                <AlertDescription>
                  Unable to proceed with invoice creation. Subscriber is not
                  assigned to a meter. Assign a meter to the subscriber before
                  proceeding
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subscriber_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Subscriber</FormLabel>
                    <FormControl>
                      <SelectSubscriberInput
                        value={field.value}
                        className="w-full"
                        onSelect={(id) => {
                          form.setValue("subscriber_id", id);
                          setSelected(true);
                          setSubscriber(id);
                        }}
                        disabled={isLoading || isFetching}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meter_id"
                render={() => (
                  <FormItem>
                    <FormLabel>Meter #</FormLabel>
                    <FormControl>
                      <Input
                        value={data?.meter?.number || 0}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="previous_reading_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Reading</FormLabel>
                    <FormControl>
                      <SelectReadingInput
                        data={data?.meter?.readings || []}
                        {...field}
                        onSelect={(id) => {
                          form.setValue("previous_reading_id", id);
                          setPreviousReading(
                            data?.meter?.readings?.find((r) => r.id === id)
                          );
                        }}
                        disabled={disableInput || !data?.meter}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="current_reading_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Reading</FormLabel>
                    <FormControl>
                      <SelectReadingInput
                        data={data?.meter?.readings || []}
                        {...field}
                        onSelect={(id) => {
                          form.setValue("current_reading_id", id);
                          setCurrentReading(
                            data?.meter?.readings?.find((r) => r.id === id)
                          );
                        }}
                        disabled={disableInput || !data?.meter}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <CreateInvoiceReadingsTable
                readings={data?.meter?.readings || []}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 bg-muted p-6 rounded-md">
            <div className="">
              <h4 className="font-bold text-xl">Invoice Details</h4>
              <p className="text-sm text-muted-foreground">
                Fill in the rate and due date
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-5 max-w-4xl text-sm">
              <div className="grid grid-cols-2">
                <span className="font-bold text-muted-foreground">
                  Previous Reading
                </span>
                <span className="text-right">
                  {formatNumber(previousReading?.reading || 0)} m&sup3;
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-bold text-muted-foreground">
                  Current Reading
                </span>
                <span className="text-right">
                  {formatNumber(currentReading?.reading || 0)} m&sup3;
                </span>
              </div>
              <div className="grid grid-cols-2 pt-4 border-t">
                <span className="font-bold text-muted-foreground">
                  Total Consumption
                </span>
                <span className="text-right">
                  {formatNumber(total_consumption)} m&sup3;
                </span>
              </div>
              <FormField
                control={form.control}
                name="formula_id"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 items-center">
                    <span className="font-bold text-muted-foreground">
                      Formula
                    </span>
                    <FormControl>
                      <div className="flex items-center justify-end">
                        <SelectFormulaInput
                          disabled={!selected}
                          data={formulaData ?? []}
                          onChange={(value) => {
                            const formula = formulaData?.find(
                              (f) => f.id === Number(value)
                            );

                            if (formula) {
                              setSelectedFormula((f) => (f = formula));
                              form.setValue("formula_id", formula.id);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        <DateSelector
                          {...field}
                          onSelect={(date) => field.onChange(date)}
                          disabled={disableInput}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 border-t pt-4">
                <span className="font-bold text-muted-foreground">
                  Amount Due
                </span>
                <span className="text-right">
                  &#8369; {formatNumber(amount_due)}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-bold text-muted-foreground">Arrears</span>
                <span className="text-right">
                  &#8369; {formatNumber(total_arrears)}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-bold text-muted-foreground">
                  Total Amount Due
                </span>
                <span className="text-right">
                  &#8369; {formatNumber(Number(total_arrears) + amount_due)}
                </span>
              </div>
            </div>
            <div className="flex">
              <Button
                type="submit"
                className="w-full"
                disabled={disableInput || !data?.meter}
              >
                {invoiceResults.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-8 p-4 bg-gray-50">
          <h3 className="text-center font-semibold text-xl">
            Sample of Invoice details Report
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                {selectedFormula &&
                  selectedFormula.columns.map((column, index) => (
                    <TableCell key={index}>{column.header}</TableCell>
                  ))}
                <TableCell>Amount Due</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {selectedFormula &&
                  selectedFormula.columns.map((column, index) => {
                    try {
                      return (
                        <TableCell key={index}>
                          {formatNumber(evaluate(column.value, variables) ?? 0)}
                        </TableCell>
                      );
                    } catch (error) {
                      return <TableCell key={index}>Error</TableCell>;
                    }
                  })}
                <TableCell>{formatNumber(amount_due)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="">
          <div className="flex flex-col gap-4">
            <h5 className="text-sm font-semibold">
              Previous Subscriber Invoices
            </h5>
            <SubscriberInvoiceTable
              data={data?.invoices ?? []}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
