import { Navigate } from "react-router";
import { type Header, SubmissionsComp } from "./data-table";

export const SubmissionHome = ({
  formId,
  initialResponses,
}: {
  formId: string;
  initialResponses: {
    headers: Header[];
    rows: any[];
    totalPages: number;
  };
}) => {
  if (!formId) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SubmissionsComp
      headers={initialResponses.headers}
      rows={initialResponses.rows}
      formId={formId}
      pageCount={initialResponses.totalPages}
    />
  );
};
