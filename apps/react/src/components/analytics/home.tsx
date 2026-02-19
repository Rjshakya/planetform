import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { type AnalyticsInterval, useAnalytics } from "@/hooks/use-analytics";
import { CommonMenu } from "../common/common-menu";
import { AnalyticsSkeleton } from "../common/skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AnalyticsComp } from "./analytics-comp";

export const AnalyticsHome = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");
  const [interval, setInterval] = useState<AnalyticsInterval>("24h");

  const { analytics, analyticsErr, isLoading } = useAnalytics(formId, interval);

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8  ">
      <CommonMenu />

      <Tabs className={""} defaultValue={"analytics"}>
        <TabsList className={" "}>
          <TabsTrigger
            className={" capitalize"}
            onClick={() =>
              navigate(
                `/submissions/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"submissions"}
          >
            submissions
          </TabsTrigger>
          <TabsTrigger className={"capitalize"} value={"analytics"}>
            analytics
          </TabsTrigger>
          <TabsTrigger
            className={" capitalize"}
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
            className={" capitalize"}
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
        <AnimatePresence>
          <TabsContent
            value={"analytics"}
            className={""}
            render={
              <motion.div
                key="submissions-analytics-content" // Unique key is vital for AnimatePresence
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid"
              >
                <AnalyticsComp
                  data={analytics!}
                  error={analyticsErr}
                  isLoading={isLoading}
                  interval={interval}
                  setInterval={setInterval}
                />
              </motion.div>
            }
          />
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
