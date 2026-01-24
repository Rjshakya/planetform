import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Loader, TriangleAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AnalyticsInterval } from "@/hooks/use-analytics";
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  isEqual,
  subDays,
  subHours,
} from "date-fns";

interface IAnalyticsObj {
  count: number;
  date: string;
}

type AnalyticsData = {
  visitors: IAnalyticsObj[] | undefined;
  uniqueVisitors: IAnalyticsObj[] | undefined;
  submissions: IAnalyticsObj[] | undefined;
  uniqueSubmissions: IAnalyticsObj[] | undefined;
};

const selectItems: { value: AnalyticsInterval; item: string }[] = [
  {
    item: "Last 6 hr",
    value: "6h",
  },
  {
    item: "Last 12 hr",
    value: "12h",
  },
  {
    item: "Last 24 hr",
    value: "24h",
  },
  {
    item: "Last 7 days",
    value: "7d",
  },
];

export const AnalyticsComp = ({
  data,
  error,
  isLoading,
  interval,
  setInterval,
}: {
  data: AnalyticsData;
  error: any;
  isLoading: boolean;
  interval: AnalyticsInterval;
  setInterval: (v: AnalyticsInterval) => void;
}) => {
  const { formId } = useParams();

  const cards = useMemo(() => {
    if (!data) return;
    return [
      {
        id: 0,
        icon: (
          <div>
            <svg
              role="icon"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-foreground"
              viewBox="0 0 24 24"
              fill="#fffcfc"
            >
              <g clipPath="url(#clip0_3261_12981)">
                <path
                  d="M9.25 1.27002C6.63 1.27002 4.5 3.40002 4.5 6.02002C4.5 8.64002 6.51 10.67 9.13 10.76C9.21 10.75 9.29 10.75 9.35 10.76H9.42C11.98 10.67 13.99 8.59002 14 6.02002C14 3.40002 11.87 1.27002 9.25 1.27002Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M20.24 6.61C20.4 8.55 19.02 10.25 17.11 10.48H17.06C17 10.48 16.94 10.48 16.89 10.5C15.92 10.55 15.03 10.24 14.36 9.67C15.39 8.75 15.98 7.37 15.86 5.87C15.79 5.06 15.51 4.32 15.09 3.69C15.47 3.5 15.91 3.38 16.36 3.34C18.32 3.17 20.07 4.63 20.24 6.61Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M22.24 15.86C22.16 16.83 21.54 17.67 20.5 18.24C19.5 18.79 18.24 19.05 16.99 19.02C17.71 18.37 18.13 17.5601 18.21 16.7C18.31 15.46 17.72 14.27 16.54 13.32C15.87 12.79 15.09 12.37 14.24 12.06C16.45 11.42 19.23 11.85 20.94 13.23C21.86 13.97 22.33 14.9 22.24 15.86Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M14.33 13.42C11.54 11.56 6.99002 11.56 4.18002 13.42C2.91002 14.27 2.21002 15.42 2.21002 16.65C2.21002 17.04 2.29002 17.41 2.42002 17.78L2.68002 17.71C3.19002 17.56 3.56002 17.19 3.70002 16.69L3.96002 15.74L4.02002 15.57C4.21002 15.07 4.69002 14.74 5.24002 14.74C5.80002 14.74 6.25002 15.08 6.44002 15.58L6.75002 16.7C6.88002 17.2 7.27002 17.58 7.76002 17.72L8.92002 18.05C9.42002 18.26 9.72002 18.73 9.72002 19.28C9.72002 19.8627 9.3212 20.3565 8.77002 20.53L7.78002 20.8C7.59002 20.85 7.42002 20.95 7.27002 21.06C7.92002 21.18 8.58002 21.27 9.25002 21.27C11.09 21.27 12.93 20.8 14.33 19.86C15.59 19.01 16.29 17.87 16.29 16.63C16.28 15.4 15.59 14.26 14.33 13.42Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M8.74 19.25C8.74 19.32 8.7 19.48 8.51 19.54L7.53 19.81C6.68 20.04 6.04 20.68 5.81 21.53L5.55 22.49C5.49 22.71 5.32 22.73 5.24 22.73C5.16 22.73 4.99 22.71 4.93 22.49L4.67 21.52C4.44 20.68 3.79 20.04 2.95 19.81L1.98 19.55C1.77 19.49 1.75 19.31 1.75 19.24C1.75 19.16 1.77 18.98 1.98 18.92L2.96 18.66C3.8 18.42 4.44 17.78 4.67 16.94L4.95 15.92C5.02 15.75 5.18 15.72 5.24 15.72C5.3 15.72 5.47 15.74 5.53 15.9L5.81 16.93C6.04 17.77 6.69 18.41 7.53 18.65L8.53 18.93C8.73 19.01 8.74 19.19 8.74 19.25Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
              </g>
              <defs>
                <clipPath id="clip0_3261_12981">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        ),
        text: "Visitors",
        data: data?.visitors,
      },
      {
        id: 1,
        icon: (
          <div>
            <svg
              role="icon"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-foreground"
              viewBox="0 0 24 24"
              fill="#fffcfc"
            >
              <g clipPath="url(#clip0_3261_12981)">
                <path
                  d="M9.25 1.27002C6.63 1.27002 4.5 3.40002 4.5 6.02002C4.5 8.64002 6.51 10.67 9.13 10.76C9.21 10.75 9.29 10.75 9.35 10.76H9.42C11.98 10.67 13.99 8.59002 14 6.02002C14 3.40002 11.87 1.27002 9.25 1.27002Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M20.24 6.61C20.4 8.55 19.02 10.25 17.11 10.48H17.06C17 10.48 16.94 10.48 16.89 10.5C15.92 10.55 15.03 10.24 14.36 9.67C15.39 8.75 15.98 7.37 15.86 5.87C15.79 5.06 15.51 4.32 15.09 3.69C15.47 3.5 15.91 3.38 16.36 3.34C18.32 3.17 20.07 4.63 20.24 6.61Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M22.24 15.86C22.16 16.83 21.54 17.67 20.5 18.24C19.5 18.79 18.24 19.05 16.99 19.02C17.71 18.37 18.13 17.5601 18.21 16.7C18.31 15.46 17.72 14.27 16.54 13.32C15.87 12.79 15.09 12.37 14.24 12.06C16.45 11.42 19.23 11.85 20.94 13.23C21.86 13.97 22.33 14.9 22.24 15.86Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M14.33 13.42C11.54 11.56 6.99002 11.56 4.18002 13.42C2.91002 14.27 2.21002 15.42 2.21002 16.65C2.21002 17.04 2.29002 17.41 2.42002 17.78L2.68002 17.71C3.19002 17.56 3.56002 17.19 3.70002 16.69L3.96002 15.74L4.02002 15.57C4.21002 15.07 4.69002 14.74 5.24002 14.74C5.80002 14.74 6.25002 15.08 6.44002 15.58L6.75002 16.7C6.88002 17.2 7.27002 17.58 7.76002 17.72L8.92002 18.05C9.42002 18.26 9.72002 18.73 9.72002 19.28C9.72002 19.8627 9.3212 20.3565 8.77002 20.53L7.78002 20.8C7.59002 20.85 7.42002 20.95 7.27002 21.06C7.92002 21.18 8.58002 21.27 9.25002 21.27C11.09 21.27 12.93 20.8 14.33 19.86C15.59 19.01 16.29 17.87 16.29 16.63C16.28 15.4 15.59 14.26 14.33 13.42Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M8.74 19.25C8.74 19.32 8.7 19.48 8.51 19.54L7.53 19.81C6.68 20.04 6.04 20.68 5.81 21.53L5.55 22.49C5.49 22.71 5.32 22.73 5.24 22.73C5.16 22.73 4.99 22.71 4.93 22.49L4.67 21.52C4.44 20.68 3.79 20.04 2.95 19.81L1.98 19.55C1.77 19.49 1.75 19.31 1.75 19.24C1.75 19.16 1.77 18.98 1.98 18.92L2.96 18.66C3.8 18.42 4.44 17.78 4.67 16.94L4.95 15.92C5.02 15.75 5.18 15.72 5.24 15.72C5.3 15.72 5.47 15.74 5.53 15.9L5.81 16.93C6.04 17.77 6.69 18.41 7.53 18.65L8.53 18.93C8.73 19.01 8.74 19.19 8.74 19.25Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
              </g>
              <defs>
                <clipPath id="clip0_3261_12981">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        ),
        text: "Unique visitors",
        data: data?.uniqueVisitors,
      },
      {
        id: 2,
        icon: (
          <div>
            <svg
              role="icon"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-foreground"
              viewBox="0 0 24 24"
              fill="#fffcfc"
            >
              <g clipPath="url(#clip0_3261_12981)">
                <path
                  d="M9.25 1.27002C6.63 1.27002 4.5 3.40002 4.5 6.02002C4.5 8.64002 6.51 10.67 9.13 10.76C9.21 10.75 9.29 10.75 9.35 10.76H9.42C11.98 10.67 13.99 8.59002 14 6.02002C14 3.40002 11.87 1.27002 9.25 1.27002Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M20.24 6.61C20.4 8.55 19.02 10.25 17.11 10.48H17.06C17 10.48 16.94 10.48 16.89 10.5C15.92 10.55 15.03 10.24 14.36 9.67C15.39 8.75 15.98 7.37 15.86 5.87C15.79 5.06 15.51 4.32 15.09 3.69C15.47 3.5 15.91 3.38 16.36 3.34C18.32 3.17 20.07 4.63 20.24 6.61Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M22.24 15.86C22.16 16.83 21.54 17.67 20.5 18.24C19.5 18.79 18.24 19.05 16.99 19.02C17.71 18.37 18.13 17.5601 18.21 16.7C18.31 15.46 17.72 14.27 16.54 13.32C15.87 12.79 15.09 12.37 14.24 12.06C16.45 11.42 19.23 11.85 20.94 13.23C21.86 13.97 22.33 14.9 22.24 15.86Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M14.33 13.42C11.54 11.56 6.99002 11.56 4.18002 13.42C2.91002 14.27 2.21002 15.42 2.21002 16.65C2.21002 17.04 2.29002 17.41 2.42002 17.78L2.68002 17.71C3.19002 17.56 3.56002 17.19 3.70002 16.69L3.96002 15.74L4.02002 15.57C4.21002 15.07 4.69002 14.74 5.24002 14.74C5.80002 14.74 6.25002 15.08 6.44002 15.58L6.75002 16.7C6.88002 17.2 7.27002 17.58 7.76002 17.72L8.92002 18.05C9.42002 18.26 9.72002 18.73 9.72002 19.28C9.72002 19.8627 9.3212 20.3565 8.77002 20.53L7.78002 20.8C7.59002 20.85 7.42002 20.95 7.27002 21.06C7.92002 21.18 8.58002 21.27 9.25002 21.27C11.09 21.27 12.93 20.8 14.33 19.86C15.59 19.01 16.29 17.87 16.29 16.63C16.28 15.4 15.59 14.26 14.33 13.42Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M8.74 19.25C8.74 19.32 8.7 19.48 8.51 19.54L7.53 19.81C6.68 20.04 6.04 20.68 5.81 21.53L5.55 22.49C5.49 22.71 5.32 22.73 5.24 22.73C5.16 22.73 4.99 22.71 4.93 22.49L4.67 21.52C4.44 20.68 3.79 20.04 2.95 19.81L1.98 19.55C1.77 19.49 1.75 19.31 1.75 19.24C1.75 19.16 1.77 18.98 1.98 18.92L2.96 18.66C3.8 18.42 4.44 17.78 4.67 16.94L4.95 15.92C5.02 15.75 5.18 15.72 5.24 15.72C5.3 15.72 5.47 15.74 5.53 15.9L5.81 16.93C6.04 17.77 6.69 18.41 7.53 18.65L8.53 18.93C8.73 19.01 8.74 19.19 8.74 19.25Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
              </g>
              <defs>
                <clipPath id="clip0_3261_12981">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        ),
        text: "Submissions",
        data: data?.submissions,
      },
      {
        id: 3,
        icon: (
          <div>
            <svg
              role="icon"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-foreground"
              viewBox="0 0 24 24"
              fill="#fffcfc"
            >
              <g clipPath="url(#clip0_3261_12981)">
                <path
                  d="M9.25 1.27002C6.63 1.27002 4.5 3.40002 4.5 6.02002C4.5 8.64002 6.51 10.67 9.13 10.76C9.21 10.75 9.29 10.75 9.35 10.76H9.42C11.98 10.67 13.99 8.59002 14 6.02002C14 3.40002 11.87 1.27002 9.25 1.27002Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M20.24 6.61C20.4 8.55 19.02 10.25 17.11 10.48H17.06C17 10.48 16.94 10.48 16.89 10.5C15.92 10.55 15.03 10.24 14.36 9.67C15.39 8.75 15.98 7.37 15.86 5.87C15.79 5.06 15.51 4.32 15.09 3.69C15.47 3.5 15.91 3.38 16.36 3.34C18.32 3.17 20.07 4.63 20.24 6.61Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M22.24 15.86C22.16 16.83 21.54 17.67 20.5 18.24C19.5 18.79 18.24 19.05 16.99 19.02C17.71 18.37 18.13 17.5601 18.21 16.7C18.31 15.46 17.72 14.27 16.54 13.32C15.87 12.79 15.09 12.37 14.24 12.06C16.45 11.42 19.23 11.85 20.94 13.23C21.86 13.97 22.33 14.9 22.24 15.86Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  opacity="0.4"
                  d="M14.33 13.42C11.54 11.56 6.99002 11.56 4.18002 13.42C2.91002 14.27 2.21002 15.42 2.21002 16.65C2.21002 17.04 2.29002 17.41 2.42002 17.78L2.68002 17.71C3.19002 17.56 3.56002 17.19 3.70002 16.69L3.96002 15.74L4.02002 15.57C4.21002 15.07 4.69002 14.74 5.24002 14.74C5.80002 14.74 6.25002 15.08 6.44002 15.58L6.75002 16.7C6.88002 17.2 7.27002 17.58 7.76002 17.72L8.92002 18.05C9.42002 18.26 9.72002 18.73 9.72002 19.28C9.72002 19.8627 9.3212 20.3565 8.77002 20.53L7.78002 20.8C7.59002 20.85 7.42002 20.95 7.27002 21.06C7.92002 21.18 8.58002 21.27 9.25002 21.27C11.09 21.27 12.93 20.8 14.33 19.86C15.59 19.01 16.29 17.87 16.29 16.63C16.28 15.4 15.59 14.26 14.33 13.42Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M8.74 19.25C8.74 19.32 8.7 19.48 8.51 19.54L7.53 19.81C6.68 20.04 6.04 20.68 5.81 21.53L5.55 22.49C5.49 22.71 5.32 22.73 5.24 22.73C5.16 22.73 4.99 22.71 4.93 22.49L4.67 21.52C4.44 20.68 3.79 20.04 2.95 19.81L1.98 19.55C1.77 19.49 1.75 19.31 1.75 19.24C1.75 19.16 1.77 18.98 1.98 18.92L2.96 18.66C3.8 18.42 4.44 17.78 4.67 16.94L4.95 15.92C5.02 15.75 5.18 15.72 5.24 15.72C5.3 15.72 5.47 15.74 5.53 15.9L5.81 16.93C6.04 17.77 6.69 18.41 7.53 18.65L8.53 18.93C8.73 19.01 8.74 19.19 8.74 19.25Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
              </g>
              <defs>
                <clipPath id="clip0_3261_12981">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        ),
        text: "Unique submission",
        data: data?.uniqueSubmissions,
      },
    ];
  }, [data]);

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center gap-4">
        <span>
          <TriangleAlert className=" text-destructive" />
        </span>
        <p>failed to get your dashboard</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-2 mt-4">
      <div className="flex">
        <Select
          value={interval}
          onValueChange={(v) => setInterval(v as AnalyticsInterval)}
        >
          <SelectTrigger className="w-[120px] ">
            <SelectValue>{interval || "last 24 hr"}</SelectValue>
          </SelectTrigger>
          <SelectContent className={""}>
            {selectItems.map((s) => {
              return <SelectItem value={s.value}>{s.item}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>
      <div className=" grid md:grid-cols-1 grid-cols-1 md:gap-4 gap-2 ">
        {cards?.map((I) => {
          return (
            <Card
              key={I.id}
              className="shadow-none gap-1 p-1.5 inset-shadow-xs inset-shadow-accent/85  "
            >
              <CardHeader className=" gap-2 px-1 py-2  ">
                <p className="text-xs text-primary ">{I.text}</p>
              </CardHeader>
              <CardContent className="px-4 py-10 bg-accent/80 dark:bg-background  inset-shadow-xs inset-shadow-black/10 border ">
                {I.data ? (
                  <AnalyticsBarChart data={I.data} interval={interval} />
                ) : (
                  <div className=" flex items-center justify-center text-muted-foreground text-sm">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const AnalyticsBarChart = ({
  data,
  interval,
}: {
  data: IAnalyticsObj[];
  interval: AnalyticsInterval;
}) => {
  const chartData = handleChartData(data, interval);

  const chartConfig = {
    date: {
      label: "Date",
      color: "var(--primary)",
    },
    count: {
      label: "Count",
      color: "var(--primary)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className=" w-full">
      <BarChart accessibilityLayer data={chartData}>
        <rect
          x="0"
          y="0"
          width="100%"
          height="85%"
          fill="url(#default-pattern-dots)"
        />
        <defs>
          <DottedBackgroundPattern />
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 8 }}
          tickLine={true}
          axisLine={true}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Bar
          shape={<CustomHatchedBar />}
          dataKey="count"
          fill="var(--color-count)"
          radius={0}
        />
      </BarChart>
    </ChartContainer>
  );
};

const CustomHatchedBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string },
) => {
  const { fill, x, y, width, height, dataKey } = props;

  return (
    <>
      <rect
        rx={0}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#hatched-bar-pattern-${dataKey})`}
      />
      <defs>
        <pattern
          key={dataKey}
          id={`hatched-bar-pattern-${dataKey}`}
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="10" height="10" opacity={0.5} fill={fill}></rect>
          <rect width="1" height="10" fill={fill}></rect>
        </pattern>
      </defs>
    </>
  );
};

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="default-pattern-dots"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="dark:text-muted/40 text-muted"
        cx="2"
        cy="2"
        r="1"
        fill="currentColor"
      />
    </pattern>
  );
};

// helpers
export const handleChartData = (
  data: IAnalyticsObj[],
  interval: AnalyticsInterval,
): IAnalyticsObj[] => {
  if (interval.includes("h")) {
    const series = getHourSeriesBasedOnInterval(interval, data);

    const dataWithSeries: IAnalyticsObj[] = series.map((s) => {
      const dataOfThisHour = data.find((d) => {
        const date = new Date(d.date);
        return isEqual(s, date);
      });

      const date = format(s, "Haaa");

      if (!dataOfThisHour) {
        return { count: 0, date };
      }

      return { ...dataOfThisHour, date };
    });

    return dataWithSeries;
  }

  if (interval === "7d") {
    const start = subDays(new Date(), 7);
    const series = createDaySeries(start);

    const dataWithSeries: IAnalyticsObj[] = series.map((s) => {
      const dataOfThisDay = data.find((d) => {
        const date = new Date(d.date);
        return isEqual(s, date);
      });

      if (dataOfThisDay) {
        return { ...dataOfThisDay, date: format(s, "eee") };
      }

      return { count: 0, date: format(s, "eee") };
    });

    return dataWithSeries;
  }

  if (interval === "30d") {
    const start = data[0].date
      ? new Date(data[0].date)
      : subDays(new Date(), 30);

    const series = createWeekSeries(start);
    const dataWithSeries: IAnalyticsObj[] = series.map((s) => {
      const formatedDate = format(s, "P");

      const dataOfThisDay = data.find((d) => {
        const date = new Date(d.date);
        return isEqual(s, date);
      });

      if (!dataOfThisDay) {
        return { count: 0, date: formatedDate };
      }

      return { ...dataOfThisDay, date: formatedDate };
    });

    return dataWithSeries;
  }

  return [{ count: 0, date: new Date().toISOString() }];
};

export const getHourSeriesBasedOnInterval = (
  interval: AnalyticsInterval,
  data: IAnalyticsObj[],
) => {
  const current = new Date();
  // const dataStarting = data[0]?.date ? new Date(data[0].date) : false;

  const last24 = subHours(current, 24);
  let series = createHourTimeSeries(last24);

  if (interval === "12h") {
    series = createHourTimeSeries(subHours(current, 12));
  }

  if (interval === "6h" || interval === "3h") {
    series = createHourTimeSeries(subHours(current, 6));
  }

  return series;
};

export const createHourTimeSeries = (start: Date) => {
  const end = new Date();
  return eachHourOfInterval({ start, end });
};

export const createDaySeries = (start: Date) => {
  const end = new Date();
  return eachDayOfInterval({ start: start, end });
};

export const createWeekSeries = (start: Date) => {
  const end = new Date();
  return eachWeekOfInterval({ start, end });
};

export const createMonthSeries = (start: Date) => {
  const end = new Date();
  return eachMonthOfInterval({ start, end });
};
