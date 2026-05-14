"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null | undefined;
  };
}) {
  const { isMobile } = useSidebar();
  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image || ""}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 p-1 "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user.image || ""}
                      alt={user.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem disabled >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 fill-amber-400"
                    viewBox="0 0 24 24"
                    fill="#fff"
                  >
                    <g clip-path="url(#clip0_655_9274)">
                      <path
                        opacity="0.4"
                        d="M16.627 12.6571C16.9007 12.1409 17.6403 12.1409 17.914 12.6571L18.2418 13.2755C18.9244 14.5629 19.9775 15.6161 21.265 16.2986L21.8833 16.6265C22.3996 16.9002 22.3996 17.6397 21.8833 17.9134L21.265 18.2413C19.9775 18.9239 18.9244 19.977 18.2418 21.2644L17.914 21.8828C17.6403 22.399 16.9007 22.399 16.627 21.8828L16.2992 21.2644C15.6166 19.977 14.5635 18.9239 13.276 18.2413L12.6577 17.9134C12.1415 17.6397 12.1415 16.9002 12.6577 16.6265L13.276 16.2986C14.5635 15.6161 15.6166 14.5629 16.2992 13.2755L16.627 12.6571Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M6.35653 2.38716C6.63021 1.87095 7.36979 1.87095 7.64347 2.38716L7.97132 3.00552C8.65391 4.29299 9.70701 5.34609 10.9945 6.02868L11.6128 6.35653C12.1291 6.63021 12.1291 7.36979 11.6128 7.64347L10.9945 7.97132C9.70701 8.65391 8.65391 9.70701 7.97132 10.9945L7.64347 11.6128C7.36979 12.1291 6.63021 12.1291 6.35653 11.6128L6.02868 10.9945C5.34609 9.70701 4.29299 8.65391 3.00552 7.97132L2.38716 7.64347C1.87095 7.36979 1.87095 6.63021 2.38716 6.35653L3.00552 6.02868C4.29299 5.34609 5.34609 4.29299 6.02868 3.00552L6.35653 2.38716Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_655_9274">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={signOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
