import { createContext, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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

type DialogProps = {
  title: string;
  description: string;
  action: () => void;
};

type DialogState = {
  createDialog: (props: DialogProps) => void;
};

const DialogContext = createContext<DialogState>({
  createDialog: (props) => null,
});

interface ConfirmationDialogProps {
  children: React.ReactNode;
}

export function ConfirmationDialogProvider({
  children,
  ...props
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogProps, setDialogProps] = useState<DialogProps>();

  const isMobile = useIsMobile();

  const value: DialogState = {
    createDialog: (props) => {
      setDialogProps(props);
      setOpen(true);
    },
  };

  return (
    <>
      <DialogContext.Provider value={value} {...props}>
        {children}
      </DialogContext.Provider>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>{dialogProps?.title}</DrawerTitle>
              <DrawerDescription>{dialogProps?.description}</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button
                className="w-full"
                onClick={() => {
                  dialogProps?.action();
                  setOpen(false);
                }}
              >
                Confirm
              </Button>
              <DrawerClose asChild>
                <Button className="w-full" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogProps?.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogProps?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={dialogProps?.action}>
                Action
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export function useConfirmationDialog() {
  const context = useContext(DialogContext);

  if (context === undefined) {
    throw new Error(
      "useConfirmationDialog must be used within ConfirmationDialogProvider"
    );
  }

  return context;
}
