import { useState } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  CirclePlus,
  Contact,
  DollarSign,
  Droplet,
  Gauge,
  Receipt,
  User,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Link } from "react-router";
import { useSidebar } from "./ui/sidebar";

const create_links = [
  {
    label: "User",
    url: "/dashboard/users/create",
    icon: User,
  },
  {
    label: "Subscriber",
    url: "/dashboard/subscribers/create",
    icon: Contact,
  },
  {
    label: "Meter",
    url: "/dashboard/meters/create",
    icon: Gauge,
  },
  {
    label: "Reading",
    url: "/dashboard/readings/create",
    icon: Droplet,
  },
  {
    label: "Invoice",
    url: "/dashboard/invoices/create",
    icon: Receipt,
  },
  {
    label: "Transaction",
    url: "/dashboard/transactions/create",
    icon: DollarSign,
  },
];

export default function QuickCreateDialog() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<boolean>(false);
  const sidebar = useSidebar();

  const DialogButton = () => (
    <Button
      className={sidebar.open ? "justify-between" : "justify-center"}
      size={sidebar.open ? "default" : "icon"}
      onClick={() => setOpen(true)}
    >
      {sidebar.open && <span>Quick Create</span>}
      <CirclePlus />
    </Button>
  );

  const Links = () =>
    create_links.map((link, index) => (
      <Button className="justify-between" variant="outline" key={index} asChild>
        <Link
          to={link.url}
          onClick={() => {
            if (isMobile) sidebar.toggleSidebar();
            setOpen(false);
          }}
        >
          {link.label}
          <link.icon />
        </Link>
      </Button>
    ));

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <DialogButton />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Quick Create</DrawerTitle>
            <DrawerDescription>Select a feature to create</DrawerDescription>
          </DrawerHeader>
          <div className="grid grid-cols-2 gap-2 p-4">
            <Links />
          </div>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DialogButton />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Create</DialogTitle>
            <DialogDescription>Select a feature to create</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            <Links />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
