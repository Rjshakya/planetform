import { AppSidebar } from "@/components/common/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { ThemeToggle } from "@/components/common/theme-toggle";
import type { Route } from "./+types/route";
import { requireAuth } from "@/lib/session";
import { getWorkspaceWithForms } from "@/hooks/use-workspace";

export async function clientLoader() {
  const user = await requireAuth();
  const workspaces = await getWorkspaceWithForms(user.id);
  return { user, workspaces };
}

// clientLoader.hydrate = true as const;

export default function DashboardRoute({ loaderData }: Route.ComponentProps) {
  return (
    <SidebarProvider>
      <AppSidebar user={loaderData.user} workspaces={loaderData.workspaces} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="" />
            <ThemeToggle />
          </div>
        </header>
        <div className="px-8">
          <div className="w-full max-w-3xl mx-auto">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
