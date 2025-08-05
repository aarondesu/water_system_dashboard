import { useGetDashboardQuery } from "~/redux/apis/dashboardApi";
import type { Route } from "./+types/index";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Loader2,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Users2,
} from "lucide-react";
import { formatNumber } from "~/lib/utils";
import dayjs from "dayjs";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import WaterConsumptionChart from "~/components/charts/water-consumption-chart";
import LatestReadingTable from "~/components/tables/latest-readings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export default function DashboardIndex() {
  const { data, isLoading, isFetching, isError } = useGetDashboardQuery();

  const currentConsumption = data?.readings.current_total_reading
    ? data.readings.current_total_reading.total_consumption
    : 0;
  const previousConsumption =
    data?.readings.previous_total_reading.total_consumption ?? 0;

  const consumption_percentage =
    ((currentConsumption - previousConsumption) / previousConsumption) * 100;

  const currentBalance = data?.invoice.current_balance.total_amount_due || 0;
  const previousBalance = data?.invoice.previous_balance.total_amount_due || 0;

  const balancePercentage =
    ((currentBalance - previousBalance) / previousBalance) * 100;

  if (!isLoading || !isFetching) {
    if (isError) {
      return (
        <div className="flex w-full h-full">
          <div className="flex flex-col m-auto gap-4 text-red-600">
            <span className="flex justify-center">
              <TriangleAlert className="w-16 h-16" />
            </span>
            <span className="font-semibold">Failed to get dashboard</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="">
              <CardHeader>
                <CardDescription>
                  Latest Total Consumption (Cubic Meters/m&sup3;)
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {formatNumber(currentConsumption || 0)} m&sup3;
                </CardTitle>
                <CardAction>
                  <Badge variant="outline" className="select-none space-x-10">
                    {consumption_percentage > 0 ? (
                      <TrendingUp />
                    ) : (
                      <TrendingDown />
                    )}
                    {formatNumber(consumption_percentage)}%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="">
                For this month of {data?.readings.current_total_reading.month}
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Latest Billed Amount</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  &#8369;
                  {formatNumber(
                    data?.invoice.current_balance.total_amount_due || 0
                  )}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline" className="">
                    {balancePercentage > 0 ? <TrendingUp /> : <TrendingDown />}
                    {formatNumber(balancePercentage || 0)}%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter>
                Expected income for the month of{" "}
                {data?.invoice.current_balance.month}
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
            <WaterConsumptionChart
              data={data?.readings.monthly_consumption || []}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Latest Reports</h3>
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
        </div>
      );
    }
  } else {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Skeleton className="w-full h-[150px]" />
          <Skeleton className="w-full h-[150px]" />
          <Skeleton className="w-full h-[150px]" />
        </div>
        <Skeleton className="w-full h-[120px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="w-full h-[600px]" />
          <Skeleton className="w-full h-[600px]" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-[40px]" />
          <Skeleton className="w-full h-[300px]" />
        </div>
      </div>
    );
  }
}
