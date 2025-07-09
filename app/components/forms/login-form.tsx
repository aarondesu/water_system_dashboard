import type React from "react";
import { cn } from "~/lib/utils";
import { Card, CardContent } from "../ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useLoginMutation } from "~/redux/apis/authApi";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../authentication-provider";

import logo from "~/assets/logoipsum-282.svg";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import type { ApiError } from "~/types";
import { useGetCookiesQuery } from "~/redux/apis/utilityApi";

const formSchema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z.string({ required_error: "Password is required" }),
});

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [login, results] = useLoginMutation();
  const cookieQuery = useGetCookiesQuery();
  const { setToken, logout } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    toast.promise(login(data).unwrap(), {
      success: (token) => {
        setToken(token);
        return "Successfully logged in!";
      },
    });
  });

  return (
    <div className={cn("flex", className)} {...props}>
      <Card className="overflow-hidden w-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col p-6 md:p-8 gap-6"
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="text-xl font-bold">
                  Water Billing & Payment System
                </h1>
                <p className="text-muted-foreground text-sm">
                  Login to your account
                </p>
              </div>
              {results.isError && (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>
                    {"data" in results.error ? (
                      <ul className="list-inside list-disc text-sm">
                        {(results.error as ApiError).data.errors.map(
                          (error, index) => (
                            <li key={index}>{error}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <span>
                        We’re having trouble connecting to the server. Please
                        check your internet connection or try again later. If
                        the issue persists, contact support.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              {cookieQuery.isError}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={results.isLoading} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passowrd</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={results.isLoading}
                        type="password"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={results.isLoading}
              >
                {results.isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          <div className="relative hidden md:flex justify-center items-center">
            <div className="flex flex-col gap-4">
              <img src={logo} className="w-[250px]" />
              <span className="text-center">
                <h3 className="text-3xl tracking-widest font-black">
                  Company Name
                </h3>
                <p className="text-sm text-muted-foreground">
                  Water Billing & Payment System
                </p>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
