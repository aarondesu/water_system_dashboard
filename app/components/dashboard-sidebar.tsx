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
import { Link } from "react-router";
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
        url: "/dashboard/users",
        icon: Users2,
      },
    ],
  },
  {
    label: "Business",
    children: [
      {
        label: "Subscribers",
        url: "/dashboard/subscribers",
        icon: Users,
      },
      {
        label: "Meters",
        url: "/dashboard/meters",
        icon: Gauge,
      },
      {
        label: "Water Readings",
        url: "/dashboard/readings",
        icon: Droplets,
      },
    ],
  },
  {
    label: "Financials",
    children: [
      {
        label: "Invoices",
        url: "/dashboard/invoices",
        icon: FileText,
      },
      {
        label: "Transactions",
        url: "/dashboard/transactions",
        icon: DollarSign,
      },
    ],
  },
];

export default function DashboardSidebar() {
  const { logout } = useAuth();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="inset">
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
                {category.children.map((link) => (
                  <SidebarMenuItem key={link.label}>
                    <SidebarMenuButton asChild>
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
                ))}
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
