import type { Route } from "./+types/page";
import { requireAuth } from "@/lib/session";
import { getUserWorkspaces } from "@/hooks/use-workspace";
import { getDashboardAnalytics } from "@/hooks/use-analytics";
import { DashboardHome } from "./home";
import { DashboardSkeleton } from "@/components/common/skeletons";

export async function clientLoader() {
  const user = await requireAuth();
  const [workspaces, analytics] = await Promise.all([
    getUserWorkspaces(user.id),
    getDashboardAnalytics(user.id),
  ]);
  return { user, workspaces: workspaces.workspace, analytics };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <DashboardSkeleton />;
}

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  return (
    <DashboardHome
      user={loaderData.user}
      workspaces={loaderData.workspaces}
      analytics={loaderData.analytics}
    />
  );
}
