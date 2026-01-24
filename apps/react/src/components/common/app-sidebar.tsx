"use client";

import * as React from "react";
import { Command, House } from "lucide-react";

import { NavMain } from "@/components/common/nav-main";
import { NavUser } from "@/components/common/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { useWorkspaceWithForms } from "@/hooks/use-workspace";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { workspaces } = useWorkspaceWithForms(user?.id);
  const navigate = useNavigate();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className=" bg-accent" size="lg">
              <div className="w-full flex items-center gap-2 ">
                <div className="bg-background grid place-content-center p-2">
                   <Logo hideName={true}/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium tracking-tight">PLANETFORM</span>
                  <span className="truncate text-xs">Company</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => navigate("/dashboard")}>
            <div className="flex items-center gap-2">
              <House className="size-4 stroke-3 text-primary" />
              <p className="mt-0.5">Dashboard</p>
            </div>
           
          </SidebarMenuButton>
        </SidebarMenuItem>
        <NavMain workspaces={workspaces} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
