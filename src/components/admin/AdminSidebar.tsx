"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Jobs", url: "/admin", icon: Briefcase },
  { title: "Applications", url: "/admin/applications", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="bg-background p-4 font-bold text-xl">Tawzeef</SidebarHeader>
      <SidebarContent className="bg-background text-foreground">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:bg-foreground data-[active=true]:text-muted hover:bg-sidebar-ring transition-colors"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2 bg-background">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <Settings className="size-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-destructive" disabled>
              <LogOut className="size-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
