import { Link } from "react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";

import logo from "~/assets/logoipsum-282.svg";
import { cn } from "~/lib/utils";

export default function SidebarLogo() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link
            to="/dashboard"
            className={cn(
              "flex gap-3 items-center",
              open ? "justify-start" : "justify-center"
            )}
          >
            <img src={logo} alt="Logo" className="w-6 h-6" />
            {open && (
              <span className="flex flex-col">
                <span className="font-black text-black text-xl">
                  Company Name
                </span>
                <span className="text-xs text-muted-foreground">
                  Water Billing & Payment System
                </span>
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
