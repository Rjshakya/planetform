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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 fill-primary"
                        viewBox="0 0 24 24"
                        fill="#fff"
                      >
                        <g clip-path="url(#clip0_4418_4295)">
                          <path
                            d="M22 11.0704V16.6504C22 19.6004 19.6 22.0004 16.65 22.0004H7.35C4.4 22.0004 2 19.6004 2 16.6504V9.44043H21.74C21.89 9.89043 21.97 10.3504 21.99 10.8404C22 10.9104 22 11.0004 22 11.0704Z"
                            fill="white"
                            style={{ fill: "var(--fillg)" }}
                          />
                          <path
                            opacity="0.4"
                            d="M21.74 9.44H2V6.42C2 3.98 3.98 2 6.42 2H8.75C10.38 2 10.89 2.53 11.54 3.4L12.94 5.26C13.25 5.67 13.29 5.73 13.87 5.73H16.66C19.03 5.72 21.05 7.28 21.74 9.44Z"
                            fill="white"
                            style={{ fill: "var(--fillg)" }}
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_4418_4295">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
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
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4 fill-foreground"
                                    viewBox="0 0 24 24"
                                    fill="#fff"
                                  >
                                    <g clip-path="url(#clip0_4418_4824)">
                                      <path
                                        opacity="0.4"
                                        d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                      <path
                                        d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z"
                                        fill="white"
                                        style={{ fill: "var(--fillg)" }}
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_4418_4824">
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
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
