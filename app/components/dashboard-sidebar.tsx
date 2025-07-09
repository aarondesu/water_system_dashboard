import {
  DollarSign,
  Droplets,
  FileText,
  Gauge,
  LayoutDashboard,
  Users,
  Users2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Link, useLocation } from "react-router";
import { useAuth } from "./authentication-provider";
import SidebarLogo from "./sidebar-logo";
import ApplicationSidebarFooter from "./sidebar-footer";
import QuickCreateDialog from "./quick-create-dialog";

type Action = {
  url: string;
  icon: React.ElementType;
};

type Link = {
  label: string;
  url: string;
  icon: React.ElementType;
  action?: Action;
};

type Category = {
  label: string;
  children: Link[];
};

const links: Category[] = [
  {
    label: "Application",
    children: [
      {
        label: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Users",
        url: "/dashboard/user",
        icon: Users2,
      },
    ],
  },
  {
    label: "Business",
    children: [
      {
        label: "Subscribers",
        url: "/dashboard/subscriber",
        icon: Users,
      },
      {
        label: "Meters",
        url: "/dashboard/meter",
        icon: Gauge,
      },
      {
        label: "Water Readings",
        url: "/dashboard/reading",
        icon: Droplets,
      },
    ],
  },
  {
    label: "Financials",
    children: [
      {
        label: "Invoices",
        url: "/dashboard/invoice",
        icon: FileText,
      },
      {
        label: "Transactions",
        url: "/dashboard/transaction",
        icon: DollarSign,
      },
    ],
  },
];

export default function DashboardSidebar() {
  const { logout } = useAuth();
  const { open } = useSidebar();
  const location = useLocation();

  const checkUrl = (url: string) => {
    // Check if url is dashboard, if it is check if the location is dashboard only to avoid uncessarry highlighting
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    } else {
      return location.pathname.startsWith(url);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <QuickCreateDialog />
        </SidebarGroup>
        {links.map((category) => (
          <SidebarGroup key={category.label}>
            <SidebarGroupLabel>{category.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.children.map((link) => {
                  return (
                    <SidebarMenuItem key={link.label}>
                      <SidebarMenuButton isActive={checkUrl(link.url)} asChild>
                        <Link to={link.url}>
                          <link.icon />
                          <span>{link.label}</span>
                        </Link>
                      </SidebarMenuButton>
                      {link.action && (
                        <SidebarMenuAction asChild>
                          <Link to={link.action.url}>
                            <link.action.icon />
                          </Link>
                        </SidebarMenuAction>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <ApplicationSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
