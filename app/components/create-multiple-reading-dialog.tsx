import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreateMultipleReadingsForm from "./forms/create-multiple-readings-form";

export default function CreateMultipleReadingDialog() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Create multiple readings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] md:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create multiple readings</DialogTitle>
        </DialogHeader>
        <CreateMultipleReadingsForm />
      </DialogContent>
    </Dialog>
  );
}
