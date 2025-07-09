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
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import SelectSubscriberInput from "../select-subscriber-input";
import {
  useGetMeterQuery,
  useUpdateMeterMutation,
} from "~/redux/apis/meterApi";
import { toast } from "sonner";
import type { ApiError } from "~/types";
import { useParams, useSearchParams } from "react-router";
import { useEffect } from "react";

const formSchema = z.object({
  subscriber_id: z.coerce.number().optional(),
  number: z.coerce.number().min(1, "Meter number must be greater than 1"),
  note: z.coerce.string(),
  status: z.enum(["active", "inactive"]),
});

export default function EditMeterForm() {
  const params = useParams();
  const id = Number(params.id);

  const [updateMeter, result] = useUpdateMeterMutation();
  const { data, isSuccess } = useGetMeterQuery(id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscriber_id: data?.subscriber_id,
      note: data?.note,
      number: data?.number,
      status: "inactive",
    },
  });

  const onSubmit = form.handleSubmit((meterData) => {
    toast.promise(updateMeter({ ...meterData, id: data?.id }).unwrap(), {
      loading: "Creating meter...",
      success: () => {
        form.reset(); // Only reset form after successfully creating meter

        return "Successfully updated meter!";
      },
      error: (response) => {
        if ("status" in response) {
          return (response as ApiError).data.errors[0];
        } else {
          return "Unknown Error Occured";
        }
      },
    });
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset(data);
    }
  }, [data, isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className=""></div>
        <FormField
          control={form.control}
          name="subscriber_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscriber</FormLabel>
              <FormControl>
                <SelectSubscriberInput
                  value={field.value || 0}
                  onSelect={(id) => {
                    form.setValue("subscriber_id", id);
                  }}
                  disabled={result.isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meter Number*</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={result.isLoading}
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
                  placeholder="Optional: Add any additional comments"
                  {...field}
                  disabled={result.isLoading}
                  className="h-56"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse md:flex-row gap-3">
          <Button
            type="reset"
            variant="outline"
            className="w-full md:w-fit"
            onClick={() => form.reset()}
          >
            Clear
          </Button>
          <Button
            type="submit"
            className="w-full md:w-fit"
            disabled={result.isLoading}
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
