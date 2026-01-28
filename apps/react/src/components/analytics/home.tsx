import { useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAnalytics, type AnalyticsInterval } from "@/hooks/use-analytics";
import { CommonMenu } from "../common/common-menu";
import { AnalyticsComp } from "./analytics-comp";
import { BodySkeleton } from "../common/body-skeleton";
import { Skeleton } from "../ui/skeleton";

export const AnalyticsHome = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const [interval, setInterval] = useState<AnalyticsInterval>("24h");

  const { analytics, analyticsErr, isLoading } = useAnalytics(formId, interval);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto pt-12 px-4 pb-8 ">
        <Skeleton className="w-60 mb-1 h-10" />
        <Skeleton className="w-150 mb-8 h-10" />
        <BodySkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8  ">
      <CommonMenu />

      <Tabs className={''} defaultValue={"analytics"}>
        <TabsList className={''}>
          <TabsTrigger
            className={' capitalize'}
            onClick={() =>
              navigate(
                `/submissions/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"submissions"}
          >
            submissions
          </TabsTrigger>
          <TabsTrigger className={'capitalize'} value={"analytics"}>analytics</TabsTrigger>
          <TabsTrigger
           className={ ' capitalize'}
            onClick={() =>
              navigate(
                `/integrations/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"integration"}
          >
            integration
          </TabsTrigger>
          <TabsTrigger
           className={ ' capitalize'}
            onClick={() =>
              navigate(
                `/settings/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"settings"}
          >
            settings
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={"analytics"}
          className={""}
          render={
            <div className="grid">
              <AnalyticsComp
                data={analytics!}
                error={analyticsErr}
                isLoading={isLoading}
                interval={interval}
                setInterval={setInterval}
              />
            </div>
          }
        />
      </Tabs>
    </div>
  );
};
