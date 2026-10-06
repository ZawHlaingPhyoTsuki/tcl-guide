"use client";

import Link from "next/link";
import {
  BookOpenIcon,
  House as IconHouse,
  LayoutDashboardIcon,
  MapPinIcon,
  Search as IconSearch,
  Settings as IconSettings,
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Overview", url: "/dashboard", icon: <LayoutDashboardIcon /> },
    { title: "Places", url: "/dashboard/places", icon: <MapPinIcon /> },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />}>
              <span>View public directory</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
