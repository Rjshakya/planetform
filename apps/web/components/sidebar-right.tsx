import * as React from "react";
import { Plus } from "lucide-react";

// import { Calendars } from "@/components/calendars"
// import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CustomizationPanel } from "./custom-nodes/CutomizationPanel";
import { useEditorStore } from "@/stores/useEditorStore";
import { AnimatePresence, motion } from "motion/react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-0 h-svh border-l w-xs hidden lg:flex "
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        {/* <NavUser user={data.user} /> */}
        Customization panel
      </SidebarHeader>
      <SidebarContent>
        <CustomizationPanel />
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}

export const AnimatedSidebarRight = () => {
  const { openSideBar } = useEditorStore((s) => s);

  return (
    <>
      <AnimatePresence>
        {openSideBar && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          >
            <SidebarRight />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
