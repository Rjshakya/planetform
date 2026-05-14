import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getFormResponses } from "@/hooks/use-responses";
import { SubmissionHome } from "./home";
import { SubmissionsSkeleton } from "@/components/common/skeletons";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await requireAuth();
  const responses = await getFormResponses({
    formId: params.formId,
    pageIndex: 0,
    pageSize: 20,
  });
  return {
    formId: params.formId,
    initialResponses: responses || { headers: [], rows: [], totalPages: 0 },
  };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <SubmissionsSkeleton />;
}

export default function SubmissionsPage({ loaderData }: Route.ComponentProps) {
  return (
    <SubmissionHome
      formId={loaderData.formId}
      initialResponses={loaderData.initialResponses}
    />
  );
}
