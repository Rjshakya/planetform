import { useState } from "react";
import { useParams } from "react-router-dom";
import { type AnalyticsInterval, useAnalytics } from "@/hooks/use-analytics";
import { AnalyticsSkeleton } from "../common/skeletons";
import { AnalyticsComp } from "./analytics-comp";

export const AnalyticsHome = () => {
  const { formId } = useParams();
  const [interval, setInterval] = useState<AnalyticsInterval>("24h");

  const { analytics, analyticsErr, isLoading } = useAnalytics(formId, interval);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <AnalyticsComp
      data={analytics!}
      error={analyticsErr}
      isLoading={isLoading}
      interval={interval}
      setInterval={setInterval}
    />
  );
};
