import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface WaterConsumptionChartProps {
  data: {
    month: string;
    total_consumption: number;
  }[];
}

export default function WaterConsumptionChart({
  data,
}: WaterConsumptionChartProps) {
  const chartConfig = {
    total_consumption: {
      label: "Reading",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Consumption</CardTitle>
        <CardDescription>Data is based on the past 12 months</CardDescription>
      </CardHeader>
      <CardContent className="mt-12">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total_consumption" fill="var(--chart-1)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
