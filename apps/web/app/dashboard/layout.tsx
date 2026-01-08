"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import { ThemeToggle } from "@/components/main-editor/simple/theme-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { AnimatedSidebarRight, SidebarRight } from "@/components/sidebar-right";
import { useEditorStore } from "@/stores/useEditorStore";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const { workspaceId } = useParams();

  return (
    <SidebarProvider className="">
      <AppSidebar className="font-sans" />
      <SidebarInset className="  p-2">
        <main className=" h-full bg-background ">
          <header
            className={cn(
              `z-50 flex h-9 pb-2 mb-8 pt-4 shrink-0 items-center gap-2 max-w-5xl mx-auto w-full sticky top-0 bg-background `,
              `${pathName?.includes("/form/create") && "hidden"}`,
              `${pathName?.includes(`form/edit`) && "hidden"}`
            )}
          >
            <div className="flex flex-1 items-center gap-2 ">
              <SidebarTrigger />
            </div>
            <div className={cn(`ml-auto flex items-center gap-2`)}>
              <div
                className={cn(
                  `${pathName?.includes("/form/view") ? "flex" : "hidden"}`
                )}
              >
                <NavActions />
              </div>

              <ThemeToggle />
            </div>
          </header>
          <div
            className={cn(
              `flex flex-1 flex-col gap-4 px-4 font-sans`,
              `${workspaceId && pathName?.includes("/form/create") && "py-0"}`,
              `${workspaceId && pathName?.includes(`/form/edit`) && "py-0"}`
            )}
          >
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
