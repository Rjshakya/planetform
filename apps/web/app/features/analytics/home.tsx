import { useState } from "react";
import { type AnalyticsInterval, getFormAnalytics } from "@/hooks/use-analytics";
import { AnalyticsSkeleton } from "@/components/common/skeletons";
import { AnalyticsComp } from "./analytics-comp";

export const AnalyticsHome = ({
  formId,
  initialAnalytics,
}: {
  formId: string;
  initialAnalytics: any;
}) => {
  const [interval, setInterval] = useState<AnalyticsInterval>("24h");
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [isLoading, setIsLoading] = useState(false);

  const handleIntervalChange = async (newInterval: AnalyticsInterval) => {
    setInterval(newInterval);
    setIsLoading(true);
    const data = await getFormAnalytics(formId, newInterval);
    setAnalytics(data);
    setIsLoading(false);
  };

  return (
    <AnalyticsComp
      data={analytics}
      error={null}
      isLoading={isLoading}
      interval={interval}
      setInterval={handleIntervalChange}
    />
  );
};
