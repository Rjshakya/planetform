"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  CheckCheck,
  Edit,
  Link as LinkIcon,
  LogOut,
  Mail,
  MailIcon,
  MoreHorizontal,
  MoveUpRight,
  Settings2,
  Star,
  Trash,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { authClient, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "./main-editor/simple/theme-toggle";
import { useParams, usePathname, useRouter } from "next/navigation";
import { fi } from "date-fns/locale";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { workspaceId, formId } = useParams();
  const appUrl = process.env.NEXT_PUBLIC_CLIENT_URL as string
  const [isCopyied, setIsCopied] = React.useState(false);
  const { data: session } = authClient?.useSession();
  const path = usePathname();
  const router = useRouter();

  const [data, setData] = React?.useState([
    [
      {
        label: "name",
        icon: User,
      },
      {
        label: "email",
        icon: MailIcon,
      },
      {
        label: "Log out",
        icon: LogOut,
      },
    ],
  ]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <DropdownMenu
        open={isOpen}
        onOpenChange={(o) => {
          setIsOpen(o);
          setIsCopied(false);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent h-7 w-7"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-40 overflow-hidden rounded-lg p-2 font-sans text-sm"
          align="end"
        >
         
      
          <DropdownMenuItem>
            <Link
              className="w-full flex items-center gap-4 text-sm"
              href={`${appUrl}/${formId}`}
              target="_blank"
            >
              <span>
                <MoveUpRight size={15} />
              </span>
              <span>Open</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              className="w-full flex items-center gap-4 text-sm"
              href={`/dashboard/${workspaceId}/form/edit/${formId}?name=${formId}`}
            >
              <span>
                <Edit size={15} />
              </span>
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="w-full flex items-center gap-4 text-sm"
            onClick={() => {
              window.navigator.clipboard.writeText(`${appUrl}/${formId}`);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 1000);
            }}
          >
            {isCopyied ? (
              <CheckCheck className="dark:text-green-400 text-green-600" />
            ) : (
              <LinkIcon />
            )}
            <span>Copy link</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
