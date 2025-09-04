import { UserPlus } from "lucide-react";
import { useState } from "react";
import MetersTable from "~/components/tables/meters-table";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

export function meta() {
  return [{ title: "Meters | Dashboard" }];
}

export default function ViewMetersPage() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Meters</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus /> Create new meter
            </Button>
          </DialogTrigger>
          <DialogContent></DialogContent>
        </Dialog>
      </div>
      <MetersTable />
    </div>
  );
}
