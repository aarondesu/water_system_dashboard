import LoginForm from "~/components/forms/login-form";
import type { Route } from "./+types/login";
import { useGetCookiesQuery } from "~/redux/apis/utilityApi";
import { AuthenticationProvider } from "~/components/authentication-provider";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }];
}

export default function Login() {
  const {} = useGetCookiesQuery();

  return (
    <AuthenticationProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </AuthenticationProvider>
  );
}
