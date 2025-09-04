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
import { Button } from "../ui/button";
import { useCreateUserMutation } from "~/redux/apis/userApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { userSchema } from "~/schemas";

interface CreateUserFormProps {
  onCreateSuccess?: () => void;
}

export default function CreateUserForm({
  onCreateSuccess = () => null,
}: CreateUserFormProps) {
  const [createUser, results] = useCreateUserMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(createUser(data).unwrap(), {
      loading: "Creating user...",
      success: () => {
        onCreateSuccess();
        form.reset();

        return "Successfully created a new user";
      },
      error: "Failed to create new user",
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-4">
          <h4 className="text-xl font-bold">Account Details</h4>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username*</FormLabel>
                <FormControl>
                  <Input {...field} disabled={results.isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={results.isLoading}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={results.isLoading}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-xl">Personal Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={results.isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="">
          <Button type="submit" className="w-full" disabled={results.isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
