import { UserPlus } from "lucide-react";
import { useState } from "react";
import CreateSubscriberForm from "~/components/forms/create-subscriber-form";
import SubscribersTable from "~/components/tables/subscribers-table";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";

export function meta() {
  return [{ title: "Subscribers | Dashboard" }];
}

export default function DashboardSubscriberPage() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Subscribers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus /> Create new subscriber
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateSubscriberForm
              onCreateSuccess={() => setOpen((open) => false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <SubscribersTable />
    </div>
  );
}
