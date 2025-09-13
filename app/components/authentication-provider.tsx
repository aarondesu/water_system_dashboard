import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useLogoutMutation, useUserQuery } from "~/redux/apis/authApi";

const session_token_key = import.meta.env.VITE_TOKEN_KEY;

type AuthenticationState = {
  logout: () => void;
  setToken: (token: string) => void;
};

const AuthenticationContext = createContext<AuthenticationState>({
  logout: () => null,
  setToken: (token) => null,
});

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

export function AuthenticationProvider({
  children,
  ...props
}: AuthenticationProviderProps) {
  const [logout] = useLogoutMutation();
  const { data } = useUserQuery();

  const location = useLocation();
  const navigate = useNavigate();
  const value = useMemo(
    () =>
      ({
        logout: () => {
          if (
            sessionStorage.getItem(session_token_key) &&
            sessionStorage.getItem(session_token_key) !== ""
          ) {
            toast.promise(logout().unwrap(), {
              loading: "Logging out...",
              success: () => {
                sessionStorage.clear();
                navigate("/dashboard/login");

                return "Successfully logged out!";
              },
              error: () => {
                sessionStorage.clear();
                navigate("/dashboard/login");

                return "Successfully logged out!";
              },
            });
          }
        },
        setToken: (token) => {
          sessionStorage.setItem(session_token_key, token);

          navigate("/dashboard");
        },
      }) as AuthenticationState,
    [logout, navigate]
  );

  useEffect(() => {
    // Check if not logged in
    if (
      (!sessionStorage.getItem(session_token_key) ||
        sessionStorage.getItem(session_token_key) === "") &&
      location.pathname !== "/dashboard/login"
    ) {
      toast.error("Login to proceed");
      navigate("/dashboard/login");
    } else if (
      sessionStorage.getItem(session_token_key) &&
      sessionStorage.getItem(session_token_key) !== "" &&
      location.pathname === "/dashboard/login"
    ) {
      toast.info("Already logged in!");
      navigate("/dashboard");
    }
  }, [sessionStorage]);

  if (
    (!sessionStorage.getItem(session_token_key) ||
      sessionStorage.getItem(session_token_key) === "") &&
    location.pathname !== "/dashboard/login"
  ) {
    return <div className="text-sm">Unauthorized. Redirecting...</div>;
  } else {
    return (
      <AuthenticationContext.Provider value={value} {...props}>
        {children}
      </AuthenticationContext.Provider>
    );
  }
}

export function useAuth() {
  const context = useContext(AuthenticationContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthenticationProvider");
  }

  return context;
}
