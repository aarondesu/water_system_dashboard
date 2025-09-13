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
import CreateReadingsForm from "./forms/create-readings-form";

export default function CreateReadingDialog() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> Create new reading
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1000px] md:min-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Create new Reading</DialogTitle>
        </DialogHeader>
        <CreateReadingsForm onCreateSuccess={() => setOpen((open) => false)} />
      </DialogContent>
    </Dialog>
  );
}
