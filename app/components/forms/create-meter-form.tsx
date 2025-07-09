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
import { useCreateMeterMutation } from "~/redux/apis/meterApi";
import { toast } from "sonner";
import type { ApiError } from "~/types";
import { useNavigate } from "react-router";

const formSchema = z.object({
  subscriber_id: z.number().optional(),
  number: z.coerce.number().min(1, "Meter number must be greater than 1"),
  note: z.string(),
  status: z.enum(["active", "inactive"]),
});

export default function CreateMeterForm() {
  const [createMeter, result] = useCreateMeterMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subscriber_id: undefined,
      number: 0,
      note: "",
      status: "inactive",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(createMeter(data).unwrap(), {
      loading: "Creating meter...",
      success: () => {
        form.reset(); // Only reset form after successfully creating meter
        navigate("/dashboard/meters");

        return "Successfully created meter!";
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
                  skipMeter={true}
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
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
