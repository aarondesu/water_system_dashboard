import { Outlet } from "react-router";
import ServerPolling from "~/components/server-polling";

export default function SubscriberLayout() {
  return (
    <ServerPolling>
      <Outlet />
    </ServerPolling>
  );
}
