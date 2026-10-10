"use client";

import Link from "next/link";
import {
  BookOpenIcon,
  House as IconHouse,
  LayoutDashboardIcon,
  MapPinIcon,
  MapPinnedIcon,
  Search as IconSearch,
  Settings as IconSettings,
  TagIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavSecondary } from "./nav-secondary";
import type { Session } from "@/features/auth/types/session";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Session["user"] | null;
}

const data = {
  navMain: [
    { title: "Overview", url: "/dashboard", icon: <LayoutDashboardIcon /> },
    { title: "Places", url: "/dashboard/places", icon: <MapPinIcon /> },
    { title: "Categories", url: "/dashboard/categories", icon: <TagIcon /> },
    { title: "Areas", url: "/dashboard/areas", icon: <MapPinnedIcon /> },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Go to Website",
      url: "/",
      icon: IconHouse,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <BookOpenIcon className="size-5!" />
              <span className="text-base font-semibold">TCL Guide</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
