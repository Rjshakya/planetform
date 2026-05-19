import { useState } from "react";
import { Navigate, useParams } from "react-router";
import { useResponses } from "@/hooks/use-responses";
import { SubmissionsSkeleton } from "@/components/common/skeletons";
import { type Header, SubmissionsComp } from "./data-table";

export const SubmissionHome = () => {
  const { formId } = useParams();
  const [state] = useState<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 20,
  });

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
    <SubmissionsComp
      headers={responses?.headers as Header[]}
      rows={responses?.rows as any[]}
      formId={formId}
      pageCount={responses?.totalPages as number}
    />
  );
};
