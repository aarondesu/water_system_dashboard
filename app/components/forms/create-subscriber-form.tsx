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
import { useCreateSubscriberMutation } from "~/redux/apis/subscriberApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { subscriberSchema } from "~/schemas";

export default function CreateSubscriberForm() {
  const [createSubscriber, results] = useCreateSubscriberMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof subscriberSchema>>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address: "",
      email: "",
      mobile_number: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(createSubscriber(data).unwrap(), {
      loading: "Creating subscriber...",
      success: () => {
        form.reset();
        navigate("/dashboard/subscriber");
        return "Successfully created subscriber!";
      },
      error: (error) => {
        return "Failed to create subscriber.";
      },
    });
  });

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
                  <Input {...field} disabled={results.isLoading} />
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
                  <Input {...field} disabled={results.isLoading} />
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
                <Input {...field} disabled={results.isLoading} />
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
                  <Input {...field} disabled={results.isLoading} />
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
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={results.isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-3 mt-5 md:mt-0">
          <Button
            className=""
            type="reset"
            onClick={() => form.reset()}
            variant="outline"
          >
            Clear
          </Button>
          <Button type="submit" disabled={results.isLoading}>
            {results.isLoading && <Loader2 className="animate-spin" />}
            <span>Create</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
