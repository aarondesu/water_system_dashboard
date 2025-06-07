import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useState } from "react";
import SelectSubscriberInput from "../select-subscriber-input";
import { Input } from "../ui/input";

const formSchema = z.object({
  subscriber_id: z.coerce.number(),
  meter_id: z.coerce.number(),
  previous_reading_id: z.coerce.number(),
  current_reading_id: z.coerce.number(),
  rate_per_unit: z.coerce.number(),
  due_date: z.date(),
});

export default function CreateInvoiceForm() {
  const [selected, setSelected] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meter_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meter #</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
