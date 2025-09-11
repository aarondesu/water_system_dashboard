import { UserPlus } from "lucide-react";
import { useState } from "react";
import CreateSubscriberForm from "~/components/forms/create-subscriber-form";
import SubscribersTable from "~/components/tables/subscribers-table";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import type { Route } from "./+types/dashboard.subscriber";
import { store } from "~/redux/store";
import { subscriberApi } from "~/redux/apis/subscriberApi";
import type { PaginationArgs } from "~/types";
import { sub } from "date-fns";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const result = await store
    .dispatch(subscriberApi.endpoints.getAllSubscribers.initiate({}))
    .unwrap()
    .then((data) => data)
    .catch((error) => {
      console.log(error);
      return undefined;
    });

  return { subscribers: result };
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Subscribers | Dashboard" }];
}

export default function DashboardSubscriberPage({
  loaderData,
}: Route.ComponentProps) {
  const data = loaderData?.subscribers ?? [];

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
      <SubscribersTable data={data} />
    </div>
  );
}
