import { ChevronRight, File, FolderClosed } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { type WorkspaceWithForms } from "@/hooks/use-workspace";
import { useNavigate } from "react-router-dom";

export function NavMain({ workspaces }: { workspaces?: WorkspaceWithForms }) {
  const navigate = useNavigate();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarMenu>
        {workspaces &&
          workspaces.length > 0 &&
          workspaces.map((item) => (
            <Collapsible key={item.name} defaultOpen={false}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate(`/dashboard/${item.id}`)}
                  tooltip={item.name!}
                >
                  <span className="flex items-center gap-2">
                    {/* icon */}
                    <span className="">
                      <FolderClosed className="text-primary" />
                    </span>
                    <span>{item.name}</span>
                  </span>
                </SidebarMenuButton>
                {item.forms?.length ? (
                  <>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      }
                    />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.forms?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              onClick={() =>
                                navigate(
                                  `/submissions/${subItem.shortId}?name=${subItem.name}&workspace=${item.id}`,
                                )
                              }
                            >
                              <span className="flex items-center gap-2">
                                {/* icon */}
                                <span>
                                  <File className="text-green-500 size-4" />
                                </span>
                                <span>{subItem.name}</span>
                              </span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
