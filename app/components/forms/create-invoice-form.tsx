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
import { useEffect, useState } from "react";
import SelectSubscriberInput from "../select-subscriber-input";
import { Input } from "../ui/input";
import { useGetSubscriberQuery } from "~/redux/apis/subscriberApi";
import { Button } from "../ui/button";
import SelectReadingInput from "../select-reading-input";
import CreateInvoiceReadingsTable from "../tables/create-invoice-readings-table";
import DateSelector from "../ui/date-selector";
import { useCreateInvoiceMutation } from "~/redux/apis/invoiceApi";
import { toast } from "sonner";
import type { ApiError, Invoice, Reading } from "~/types";
import { cn, formatNumber } from "~/lib/utils";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router";
import SubscriberInvoiceTable from "../tables/subscriber-invoice-table";

const formSchema = z.object({
  subscriber_id: z.coerce.number(),
  meter_id: z.coerce.number(),
  previous_reading_id: z.number().or(z.undefined()),
  current_reading_id: z.number().min(1, "Current Reading is required"),
  rate_per_unit: z.coerce.number().min(1, "Rate Per unit is required"),
  due_date: z.date(),
});

export default function CreateInvoiceForm() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<boolean>(
    params.get("subscriber_id") ? true : false
  );
  const [subscriber, setSubscriber] = useState<number>(
    Number(params.get("subscriber_id"))
  );
  const [createInvoice, invoiceResults] = useCreateInvoiceMutation();

  const [previousReading, setPreviousReading] = useState<Reading>();
  const [currentReading, setCurrentReading] = useState<Reading>();

  const { data, isLoading, isFetching, isSuccess, refetch } =
    useGetSubscriberQuery(subscriber);

  const disableInput =
    !selected || isLoading || isFetching || invoiceResults.isLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscriber_id: 0,
      current_reading_id: Number(params.get("reading_id")) || 0,
      rate_per_unit: 0,
    },
  });

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
          rate_per_unit: data.rate_per_unit,
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
    if (isSuccess && subscriber !== 0) {
      form.reset({
        subscriber_id: data.id,
        meter_id: data.meter?.id,
        previous_reading_id: 0,
        current_reading_id: Number(params.get("reading_id") || 0),
        rate_per_unit: form.getValues("rate_per_unit"),
        due_date: form.getValues("due_date"),
      });

      // Set the current reading to the preselected reading based on the search param
      setCurrentReading(
        data?.meter?.readings?.find(
          (r) => r.id === Number(params.get("reading_id"))
        )
      );
    }
  }, [data, isSuccess, subscriber]);

  const amount_due =
    (Number(currentReading?.reading || 0) -
      Number(previousReading?.reading || 0)) *
    Number(form.watch("rate_per_unit") || 0);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
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
                        disabled={disableInput}
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
                        disabled={disableInput}
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
                  {formatNumber(
                    (currentReading?.reading || 0) -
                      (previousReading?.reading || 0)
                  )}{" "}
                  m&sup3;
                </span>
              </div>
              <FormField
                control={form.control}
                name="rate_per_unit"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-2 items-center">
                    <span className="font-bold text-muted-foreground">
                      Rate per unit( &#8369;/m&sup3; )
                    </span>
                    <FormControl>
                      <div className="flex items-center justify-end">
                        <Input
                          {...field}
                          className={cn(
                            "border-transparent shadow-none text-right w-16 h-8 px-2 hover:bg-input/20",
                            !field.value && field.value < 1 && "bg-input",
                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          )}
                          inputMode="numeric"
                          type="number"
                          disabled={disableInput}
                        />
                        <span className="text-sm">&#8369;/m&sup3;</span>
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
                  &#8369;{" "}
                  {formatNumber(
                    data?.invoices[0] ? data?.invoices[0].arrears : 0
                  )}
                </span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-bold text-muted-foreground">
                  Total Amount Due
                </span>
                <span className="text-right">
                  &#8369;{" "}
                  {formatNumber(
                    Number(data?.invoices[0] ? data?.invoices[0].arrears : 0) +
                      Number(amount_due)
                  )}
                </span>
              </div>
            </div>
            <div className="flex">
              <Button type="submit" className="w-full" disabled={disableInput}>
                {invoiceResults.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </div>
          </div>
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
