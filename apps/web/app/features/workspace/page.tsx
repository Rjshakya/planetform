import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getWorkspace } from "@/hooks/use-workspace";
import { WorkspaceHome } from "./home";
import { WorkspaceSkeleton } from "@/components/common/skeletons";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const user = await requireAuth();
  const workspace = await getWorkspace(params.workspaceId);
  return {
    user,
    workspace: workspace.workspace as import("@/hooks/use-workspace").Workspace,
  };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <WorkspaceSkeleton />;
}

export default function WorkspacePage({ loaderData }: Route.ComponentProps) {
  return (
    <WorkspaceHome user={loaderData.user} workspace={loaderData.workspace} />
  );
}
