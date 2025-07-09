import { useParams } from "react-router";
import dayjs from "dayjs";
import { useGetLatestReadingsPerMeterQuery } from "~/redux/apis/readingApi";
import { GenerateInvoicesTable } from "../tables/generate-invoices-table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import DateRangePicker from "../ui/date-picker";
import { cn, formatNumber, resolvePromises } from "~/lib/utils";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import DateSelector from "../ui/date-selector";
import { Button } from "../ui/button";
import { useIsMobile } from "~/hooks/use-mobile";
import { useCreateInvoiceMutation } from "~/redux/apis/invoiceApi";
import type { Invoice } from "~/types";
import { toast } from "sonner";

const formSchema = z.object({
  due_date: z.date({ required_error: "Due date is required" }),
  rate_per_unit: z.coerce.number().min(1, "Rate per unit is Required"),
});

export default function GenerateInvoiceForm() {
  const isMobile = useIsMobile();
  const params = useParams();
  const { data } = useGetLatestReadingsPerMeterQuery();
  const [createInvoice, createInvoiceResults] = useCreateInvoiceMutation();
  const [date, setDate] = useState<DateRange | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rate_per_unit: 0,
    },
  });

  let total_consumption = 0;
  data?.forEach((meter) => {
    if (meter.readings[0]) {
      if (meter.readings[1]) {
        total_consumption +=
          (meter.readings[0].reading || 0) - (meter.readings[1].reading || 0);
      } else {
        total_consumption += meter.readings[0].reading;
      }
    }
  });

  const from = dayjs(params.from);
  const to = dayjs(params.to);

  const onSubmit = form.handleSubmit((formData) => {
    const tasks: (() => Promise<any>)[] = [];
    data?.map((meter) =>
      tasks.push(() => {
        const invoice: Invoice = {
          due_date: formData.due_date,
          rate_per_unit: formData.rate_per_unit,
          meter_id: Number(meter.id || 0),
          subscriber_id: Number(meter.subscriber_id || 0),
          arrears: 0,
          current_reading_id: meter.readings[0].id || 0,
          invoice_number: "",
          amount_due: 0,
          consumption: 0,
        };

        return createInvoice(invoice).unwrap();
      })
    );

    // Prevent window from refreshing/closing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    toast.promise(resolvePromises(tasks), {
      loading:
        "Creating invoices. DO NOT REFRESH/CLOSE THE BROWSER. Please wait...",
      success: () => {
        return "Successfully created invoices";
      },
      error: () => {
        return "Error occurred";
      },
      finally: () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      },
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col space-y-3">
        <div className="text-sm bg-muted p-4 rounded-md space-y-4">
          <div>
            <h5 className="font-bold text-lg">Invoice Details</h5>
          </div>
          <div className="space-y-4">
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
                    <div className="flex items-center justify-end">
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
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold text-muted-foreground">
                Total Amount Due (Does not include arrears)
              </span>
              <span className="text-right space-x-2">
                <span>&#8369;</span>
                <span>
                  {formatNumber(
                    total_consumption * form.watch("rate_per_unit")
                  )}
                </span>
              </span>
            </div>
          </div>
          <div className="flex justify-end mt-4 ">
            <Button
              className={cn(isMobile ? "w-full" : "w-fit")}
              type="submit"
              disabled={createInvoiceResults.isLoading}
            >
              Submit
            </Button>
          </div>
        </div>
        <GenerateInvoicesTable
          data={data || []}
          rate_per_unit={form.watch("rate_per_unit")}
        />
      </form>
    </Form>
  );
}
