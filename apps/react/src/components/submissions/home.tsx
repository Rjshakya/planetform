import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useResponses } from "@/hooks/use-responses";
import { CommonMenu } from "../common/common-menu";
import { SubmissionsSkeleton } from "../common/skeletons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { type Header, SubmissionsComp } from "./data-table";

export const SubmissionHome = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const [state] = useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 20,
  });
  const formName = searchParams.get("name");
  const workspace = searchParams.get("workspace");

  const navigate = useNavigate();
  const { responses, responseLoading, responsesErr } = useResponses({
    formId,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
  });

  if (responseLoading) {
    return <SubmissionsSkeleton />;
  }

  if (responsesErr) {
    return <p className="text-destructive">responses error</p>;
  }

  if (!formId) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 px-4 pb-8">
      <CommonMenu />

      <Tabs defaultValue={"submissions"}>
        <TabsList className={""}>
          <TabsTrigger className={"capitalize"} value={"submissions"}>
            submissions
          </TabsTrigger>
          <TabsTrigger
            className={"capitalize"}
            onClick={() =>
              navigate(
                `/analytics/${formId}?name=${formName}&workspace=${workspace}`,
              )
            }
            value={"analytics"}
          >
            analytics
          </TabsTrigger>
          <TabsTrigger
            className={"capitalize"}
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
            className={"capitalize"}
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
            value={"submissions"}
            className={""}
            render={
              <motion.div
                key="submissions-content" // Unique key is vital for AnimatePresence
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-4"
              >
                <SubmissionsComp
                  headers={responses?.headers as Header[]}
                  rows={responses?.rows as any[]}
                  formId={formId}
                  pageCount={responses?.totalPages as number}
                />
              </motion.div>
            }
          />
        </AnimatePresence>
      </Tabs>
    </div>
  );
};
