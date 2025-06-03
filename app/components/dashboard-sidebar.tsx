import {
  Banknote,
  ChevronUp,
  Coins,
  DollarSign,
  Droplets,
  Gauge,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  NotepadText,
  Plus,
  PlusCircle,
  Receipt,
  User2,
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
} from "./ui/sidebar";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "./authentication-provider";
import SidebarLogo from "./sidebar-logo";
import ApplicationSidebarFooter from "./sidebar-footer";

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
        action: {
          url: "/dashboard/users/create",
          icon: PlusCircle,
        },
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
        action: {
          url: "/dashboard/subscribers/create",
          icon: PlusCircle,
        },
      },
      {
        label: "Meters",
        url: "/dashboard/meters",
        icon: Gauge,
        action: {
          url: "/dashboard/meters/create",
          icon: PlusCircle,
        },
      },
      {
        label: "Water Readings",
        url: "/dashboard/readings",
        icon: Droplets,
        action: {
          url: "/dashboard/readings/create",
          icon: PlusCircle,
        },
      },
    ],
  },
  {
    label: "Financials",
    children: [
      {
        label: "Invoices",
        url: "/dashboard/invoices",
        icon: Receipt,
      },
      {
        label: "Transactions",
        url: "/dashboard/transactions",
        icon: Banknote,
      },
    ],
  },
];

export default function DashboardSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
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
