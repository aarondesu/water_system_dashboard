import { ClockPlus, Gauge, UserPlus } from "lucide-react";
import { useState } from "react";
import CreateMeterForm from "~/components/forms/create-meter-form";
import MetersTable from "~/components/tables/meters-table";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import type { Route } from "./+types/dashboard.meter";
import { meterApi } from "~/redux/apis/meterApi";
import { store } from "~/redux/store";

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const result = await store
    .dispatch(meterApi.endpoints.getAllMeters.initiate())
    .unwrap()
    .then((data) => data)
    .catch((error) => {
      console.log(error);
      return undefined;
    });

  return result;
}

export function meta() {
  return [{ title: "Meters | Dashboard" }];
}

export default function ViewMetersPage({ loaderData }: Route.ComponentProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h2 className="font-bold text-2xl grow">Meters</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <ClockPlus /> Create new meter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateMeterForm onCreateSuccess={() => setOpen((open) => false)} />
          </DialogContent>
        </Dialog>
      </div>
      <MetersTable data={loaderData ?? []} />
    </div>
  );
}
