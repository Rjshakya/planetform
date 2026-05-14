import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getIntegrations } from "@/hooks/use-integrations";
import { IntegrationsHome } from "./home";
import { IntegrationsSkeleton } from "@/components/common/skeletons";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await requireAuth();
  const data = await getIntegrations(params.formId);
  return { formId: params.formId, integrations: data?.integrations || [] };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <IntegrationsSkeleton />;
}

export default function IntegrationsPage({ loaderData }: Route.ComponentProps) {
  return (
    <IntegrationsHome
      formId={loaderData.formId}
      integrations={loaderData.integrations}
    />
  );
}
