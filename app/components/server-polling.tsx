import { useEffect } from "react";
import { toast } from "sonner";
import { useLazyCheckServerHealthQuery } from "~/redux/apis/utilityApi";

interface ServerPollingProps {
  children: React.ReactNode;
}

export default function ServerPolling({ children }: ServerPollingProps) {
  const [checkServerHealth, {}] = useLazyCheckServerHealthQuery();

  useEffect(() => {
    toast.promise(checkServerHealth().unwrap(), {
      loading: "Checking server health...",
      success: "Server is alive.",
      error: () => ({
        message: "Server Unresponsive",
        description:
          "We're having trouble connecting to the server. Please check your internet connection or try again later.",
      }),
    });
  }, []);

  return children;
}
