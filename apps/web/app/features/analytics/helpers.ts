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
import type { IAnalyticsObj } from "./analytics-comp";
import type { AnalyticsInterval } from "@/hooks/use-analytics";

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
