"use client";

import * as React from "react";
import { House } from "lucide-react";

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
import { useNavigate } from "react-router-dom";
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
                  <Logo hideName={true} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight ">
                    Planetform
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    company
                  </span>
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
              <span className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-primary "
                  viewBox="0 0 24 24"
                >
                  <g clip-path="url(#clip0_4418_4932)">
                    <path
                      opacity="0.4"
                      d="M20.0402 6.81969L14.2802 2.78969C12.7102 1.68969 10.3002 1.74969 8.79023 2.91969L3.78023 6.82969C2.78023 7.60969 1.99023 9.20969 1.99023 10.4697V17.3697C1.99023 19.9197 4.06023 21.9997 6.61023 21.9997H17.3902C19.9402 21.9997 22.0102 19.9297 22.0102 17.3797V10.5997C22.0102 9.24969 21.1402 7.58969 20.0402 6.81969Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18C12.75 18.41 12.41 18.75 12 18.75Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4932">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
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
