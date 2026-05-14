import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getFormAnalytics } from "@/hooks/use-analytics";
import { AnalyticsHome } from "./home";
import { AnalyticsSkeleton } from "@/components/common/skeletons";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await requireAuth();
  const analytics = await getFormAnalytics(params.formId, "24h");
  return { formId: params.formId, initialAnalytics: analytics };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <AnalyticsSkeleton />;
}

export default function AnalyticsPage({ loaderData }: Route.ComponentProps) {
  return (
    <AnalyticsHome
      formId={loaderData.formId}
      initialAnalytics={loaderData.initialAnalytics}
    />
  );
}
