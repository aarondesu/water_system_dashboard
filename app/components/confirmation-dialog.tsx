import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Button } from "./ui/button";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  action: () => void;
  open: boolean;
  disabled?: boolean;
  setOpen?: (open: boolean) => void;
}

export default function ConfirmationDialog({
  title,
  description,
  open,
  action,
  disabled = false,
  setOpen = () => null,
}: ConfirmationDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
            <DrawerFooter>
              <Button className="w-full" onClick={action}>
                Confirm
              </Button>
              <DrawerClose asChild>
                <Button className="w-full" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={disabled} onClick={action}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
}
