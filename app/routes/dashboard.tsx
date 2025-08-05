import { Outlet } from "react-router";
import { AuthenticationProvider } from "~/components/authentication-provider";
import { ConfirmationDialogProvider } from "~/components/confirmation-dialog-provider";
import DashboardSidebar from "~/components/dashboard-sidebar";
import PageNavigation from "~/components/page-navigation";
import ServerPolling from "~/components/server-polling";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function Layout() {
  return (
    <AuthenticationProvider>
      <ServerPolling>
        <ConfirmationDialogProvider>
          <SidebarProvider>
            <div className="flex flex-row min-h-svh w-full">
              <DashboardSidebar />
              <div className="flex flex-col grow gap-4 bg-white">
                <PageNavigation />
                <main className="py-2 px-6 h-full container">
                  <Outlet />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ConfirmationDialogProvider>
      </ServerPolling>
    </AuthenticationProvider>
  );
}
