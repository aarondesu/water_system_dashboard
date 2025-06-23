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
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import SelectMeterInput from "../select-meter-input";
import { useLazyGetMeterQuery } from "~/redux/apis/meterApi";
import { toast } from "sonner";
import MeterReadingsTable from "../tables/meter-readings-table";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import DatePicker from "../ui/date-picker";
import { useCreateReadingMutation } from "~/redux/apis/readingApi";
import { Link, useNavigate, useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import { useIsMobile } from "~/hooks/use-mobile";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon, Terminal } from "lucide-react";

const formSchema = z.object({
  meter_id: z.number().min(1, { message: "Select meter for reading" }),
  reading: z.coerce
    .number()
    .min(1, { message: "Current meter reading is required" }),
  start_date: z.coerce.date({
    message: "Start and End date are required",
  }),
  end_date: z.coerce.date({
    message: "Start and End date are required",
  }),
  note: z.string().optional().or(z.literal("")),
});

export default function CreateReadingsForm() {
  const [selected, setSelected] = useState<boolean>(false);
  const [getMeter, meterResults] = useLazyGetMeterQuery();
  const [createReading, readingResults] = useCreateReadingMutation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [param] = useSearchParams();
  const meter_id = Number(param.get("meter")) || 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meter_id: meter_id,
      reading: 0,
      start_date: undefined,
      end_date: undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(createReading(data).unwrap(), {
      loading: "Creating meter reading...",
      success: () => {
        meterResults.reset();
        // navigate("/dashboard/readings");
        return "Successfully created reading";
      },
      error: "Failed to create reading",
    });
  });

  useEffect(() => {
    if (param.get("meter")) {
      setSelected(true);
      getMeter(meter_id);
    }
  }, [param]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <h5 className="font-bold">Reading Details</h5>
          {meterResults.data && meterResults.data.status !== "active" && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Inactive Meter Detected</AlertTitle>
              <AlertDescription>
                The meter you've selected is currently inactive. Please activate
                the meter before proceeding with this process.
              </AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
            <FormField
              control={form.control}
              name="meter_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Meter #*</FormLabel>
                  <FormControl>
                    <SelectMeterInput
                      {...field}
                      disabled={
                        meterResults.isLoading || readingResults.isLoading
                      }
                      onSelect={(id) => {
                        if (id !== 0 || id !== undefined) {
                          toast.promise(getMeter(id).unwrap(), {
                            loading: "Retrieving meter information...",
                            success: "Done!",
                            error: "Failed to retrieve meter information",
                            finally: () => {
                              form.setValue("meter_id", id);
                              setSelected(true);
                            },
                          });
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Meter Reading*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Current Reading..."
                      disabled={
                        !selected ||
                        meterResults.isLoading ||
                        meterResults.isFetching ||
                        readingResults.isLoading
                      }
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="start_date"
            render={() => (
              <FormItem>
                <FormLabel>Reading date</FormLabel>
                <FormControl>
                  <DatePicker
                    onSelect={(range) => {
                      console.log(range);

                      // Check if from and to are not undefined
                      if (range?.from && range?.to) {
                        form.setValue("start_date", range.from);
                        form.setValue("end_date", range.to);
                      }
                    }}
                    className="w-full"
                    disabled={
                      !selected ||
                      meterResults.isLoading ||
                      meterResults.isFetching ||
                      readingResults.isLoading
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={
                      !selected ||
                      meterResults.isLoading ||
                      meterResults.isFetching ||
                      readingResults.isLoading
                    }
                    placeholder="Optional: Add any additional comments"
                    className="min-h-32"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <h5 className="font-bold">Previous Readings</h5>
          <MeterReadingsTable
            data={meterResults.data?.readings || []}
            isLoading={meterResults.isLoading || meterResults.isFetching}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-2">
          <Button
            className={cn(isMobile ? "w-full" : "w-auto")}
            variant="outline"
            asChild
          >
            <Link to="/dashboard/readings">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={
              !selected ||
              meterResults.isLoading ||
              meterResults.isFetching ||
              readingResults.isLoading
            }
            className={cn(isMobile ? "w-full" : "w-auto")}
          >
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
