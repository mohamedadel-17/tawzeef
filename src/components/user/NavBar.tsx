"use client";

"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
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
import { handleSignOut } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

const menuItems = [
  { title: "Jobs", url: "/home" },
  { title: "My Applications", url: "/home/applications" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="h-14 flex items-center w-full px-6">
        <div className="flex-1 flex justify-start">
          <Link href="/home" className="text-4xl font-logo">
            Tawzeef
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Button
                    key={item.url}
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

        <div className="flex-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <form action={handleSignOut}>
            <Button
              variant="ghost"
              type="submit"
              className="text-destructive hover:text-destructive hover:bg-sidebar-ring transition-colors cursor-pointer"
            >
              <LogOut className="size-5" />
              <span>Logout</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
