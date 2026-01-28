import { useResponses } from "@/hooks/use-responses";
import { useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SubmissionsComp, type Header,  } from "./data-table";
import { CommonMenu } from "../common/common-menu";
import { BodySkeleton } from "../common/body-skeleton";
import { Skeleton } from "../ui/skeleton";

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
    return (
      <div className="max-w-3xl mx-auto pt-12 px-4 pb-8 ">
        <Skeleton className="w-60 mb-1 h-10" />
        <Skeleton className="w-150 mb-1 h-10" />
        <BodySkeleton />
      </div>
    );
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
        <TabsList>
          <TabsTrigger className={'capitalize'} value={"submissions"}>submissions</TabsTrigger>
          <TabsTrigger
            className={'capitalize'}
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
            className={'capitalize'}
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
            className={'capitalize'}
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
          value={"submissions"}
          className={""}
          render={
            <div className="mt-4">
              <SubmissionsComp
                headers={responses?.headers as Header[]}
                rows={responses?.rows as any[]}
                formId={formId}
                pageCount={responses?.totalPages as number}
              />
            </div>
          }
        />
      </Tabs>
    </div>
  );
};
