import { useGetDashboardQuery } from "~/redux/apis/dashboardApi";
import type { Route } from "./+types/index";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Users2 } from "lucide-react";
import { formatNumber } from "~/lib/utils";
import dayjs from "dayjs";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import WaterConsumptionChart from "~/components/charts/water-consumption-chart";
import LatestReadingTable from "~/components/tables/latest-readings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export function HydrateFallback() {
  return <>test</>;
}

export default function DashboardIndex() {
  const { data } = useGetDashboardQuery();

  const latestReading = data?.readings.list[data?.readings.list.length - 1];
  const previousReading = data?.readings.list[data?.readings.list.length - 2];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="">
          <CardHeader>
            <CardDescription>
              Total Consumption (Cubic Meters/m&sup3;)
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {formatNumber(latestReading?.total_consumption || 0)} m&sup3;
            </CardTitle>
          </CardHeader>
          <CardFooter className="">
            For this month of {latestReading?.month}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Billed Amount</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              &#8369;
              {formatNumber(
                data?.invoice.current_invoice.total_amount_due || 0
              )}
            </CardTitle>
          </CardHeader>
          <CardFooter>
            Expected income for the month of{" "}
            {data?.invoice.current_invoice.month}
          </CardFooter>
        </Card>
      </div>
      <div className="space-y-4 bg-muted p-4 rounded-md @container/card">
        <div className="">
          <h5 className="font-semibold">Payment</h5>
          <div className="text-sm">Lorem Ipsum</div>
        </div>
        <Button>Quick Payment</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WaterConsumptionChart data={data?.readings.list || []} />
      </div>
      <Tabs defaultValue="readings">
        <TabsList>
          <TabsTrigger value="readings">Water Readings</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>
        <TabsContent value="readings" className="mt-2">
          <div className="space-y-4">
            <LatestReadingTable data={data?.readings.latest || []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
