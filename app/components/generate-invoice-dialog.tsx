import { useIsMobile } from "~/hooks/use-mobile";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { FilePlus } from "lucide-react";
import DateRangePicker from "./ui/date-picker";
import type { DateRange } from "react-day-picker";
import { useNavigate } from "react-router";

export default function GenerateInvoiceDialog() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const onDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setDate(undefined);
    }
    setOpen(isOpen);
  };

  const title = "Generate Invoice";
  const description = "Generate invoices based on the selected reading period";

  const onClick = () => {
    navigate(
      `/dashboard/invoice/generate/${date?.from?.toJSON()}/${date?.to?.toJSON()}`
    );
  };

  const InvoiceDialogButton = () => (
    <Button variant="outline" onClick={() => setOpen(true)}>
      <FilePlus />
      Generate Invoice
    </Button>
  );

  const SubmitButton = () => (
    <Button onClick={onClick} disabled={date === undefined}>
      Submit
    </Button>
  );

  const InvoiceDialogContent = () => (
    <div>
      <DateRangePicker value={date} onChange={setDate} />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onDialogClose}>
        <DrawerTrigger asChild>
          <InvoiceDialogButton />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <InvoiceDialogContent />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
            <SubmitButton />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={onDialogClose}>
        <DialogTrigger asChild>
          <InvoiceDialogButton />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <InvoiceDialogContent />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
