import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getCustomDomains } from "@/hooks/use-custom-domain";
import { getWorkspaceWithForms } from "@/hooks/use-workspace";
import { CustomDomainHome } from "./home";
import { CustomDomainSkeleton } from "@/components/common/skeletons";

export async function clientLoader() {
  const user = await requireAuth();
  const [domains, workspaces] = await Promise.all([
    getCustomDomains(),
    getWorkspaceWithForms(user.id),
  ]);
  return { user, domains, workspaces };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <CustomDomainSkeleton />;
}

export default function CustomDomainPage({ loaderData }: Route.ComponentProps) {
  return (
    <CustomDomainHome
      user={loaderData.user}
      domains={loaderData.domains}
      workspaces={loaderData.workspaces}
    />
  );
}
