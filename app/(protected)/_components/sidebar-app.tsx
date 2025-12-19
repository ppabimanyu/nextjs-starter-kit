"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { SidebarNavMain } from "./sidebar-nav-main";
import { SidebarNavSecondary } from "./sidebar-nav-secondary";
import { SidebarNavUser } from "./sidebar-user";
import SidebarAppHeader from "./sidebar-app-header";

export function SidebarApp({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarAppHeader />
      <SidebarContent>
        <SidebarNavMain />
        <SidebarNavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
