import { client } from "@/lib/hc";
import useSWR from "swr";

export type AnalyticsInterval =
  | "3h"
  | "6h"
  | "12h"
  | "24h"
  | "7d"
  | "30d"
  | "3M"
  | "6M"
  | "1Y";

export const useDashboardAnalytics = (customerId: string) => {
  const fetcher = () => () => getDashboardAnalytics(customerId);
  const { data, error, isLoading } = useSWR(
    customerId ? `useDashboardAnalytics:${customerId}` : null,
    fetcher(),
  );

  return { analytics: data, error, isLoading };
};

export const useAnalytics = (
  formId: string | undefined,
  interval: AnalyticsInterval,
) => {
  const fetcher = (key: string) =>
    getFormAnalytics(key.split(":")[1].trim(), interval);

  const key = formId ? `useAnalytics:${formId}:${interval}` : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return {
    analytics: data,
    analyticsErr: error,
    isLoading,
    mutate,
  };
};

export const getDashboardAnalytics = async (customerId: string) => {
  const res = await client.api.analytics.dashboard[":customerId"].$get({
    param: { customerId },
  });
  return await res.json();
};

export const getFormAnalytics = async (
  formId: string,
  interval: AnalyticsInterval,
) => {
  const res = await client.api.analytics.form.$get({
    query: { formId, interval },
  });

  if (!res.ok) throw new Error("getFormAnalytics");

  const json = await res.json();
  return json;
};
