"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { ROUTES } from "@/constants/routes";

const menuItems = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: ROUTES.USERS,
    icon: Users,
  },
  {
    title: "Products",
    href: ROUTES.PRODUCTS,
    icon: Package,
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const logout = useAuthStore(
    (state) => state.logout
  );

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-xl font-bold">
          XoomGrid
        </h2>
      </div>

      <Separator />

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Button
              key={item.href}
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />

                {item.title}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />

          Logout
        </Button>
      </div>
    </aside>
  );
}