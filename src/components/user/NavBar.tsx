"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Jobs", url: "/home" },
  { title: "My Applications", url: "/home/applications" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="h-14 flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-6">
          <Link href="/home" className="font-bold text-xl">
            Tawzeef
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Button
                    asChild
                    variant="ghost"
                    data-active={isActive}
                    className="data-[active=true]:bg-foreground data-[active=true]:text-muted hover:bg-sidebar-ring transition-colors"
                  >
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
