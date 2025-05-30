import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useCreateSubscriberMutation,
  useGetSubscriberQuery,
  useUpdateSubscriberMutation,
} from "~/redux/apis/subscriberApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo } from "react";

const formSchema = z.object({
  first_name: z.string().nonempty({ message: "First Name must not be empty" }),
  last_name: z.string().nonempty({ message: "Last Name must not be empty" }),
  mobile_number: z
    .string()
    .nonempty({ message: "Mobile number must not be empty" }),
  address: z.string().nonempty({ message: "First Name must not be empty" }),
  email: z.string().email().optional().or(z.literal("")),
});

export default function EditSubscriberForm() {
  const [params] = useSearchParams();
  const id = Number(params.get("id"));

  const [updateSubscriber, results] = useUpdateSubscriberMutation();
  const { data, isSuccess, isLoading } = useGetSubscriberQuery(id);

  const isLoadingData = isLoading || results.isLoading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(
      updateSubscriber({
        subscriber: data,
        id: id,
      }).unwrap(),
      {
        loading: "Updating subscriber...",
        success: () => {
          return "Subscriber Updated!";
        },
        error: "Failed to update subscriber",
      }
    );
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset(data);
    }
  }, [data, isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <h4 className="font-bold">Account Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-transparent bg-muted focus-visible:bg-white"
                    disabled={isLoadingData}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-transparent bg-muted focus-visible:bg-white"
                    disabled={isLoadingData}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address*</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-transparent bg-muted focus-visible:bg-white"
                  disabled={isLoadingData}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-4">
          <h4 className="font-bold">Contact Details</h4>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-transparent bg-muted focus-visible:bg-white"
                    disabled={isLoadingData}
                  />
                </FormControl>
                <FormDescription className="text-xs">Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="string"
                    className="border-transparent bg-muted focus-visible:bg-white"
                    disabled={isLoadingData}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-3 mt-5 md:mt-0">
          <Button type="submit" disabled={isLoadingData}>
            {isLoading && <Loader2 className="animate-spin" />}
            <span>Save</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
