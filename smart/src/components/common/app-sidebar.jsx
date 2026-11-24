"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { decodeJwtPayload } from "@/lib/jwt";
import { ROUTES } from "@/constants/routes";

import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Cog,
  ExternalLink,
  Factory,
  FileText,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Tv,
  Users,
  UserPlus,
  X,
} from "lucide-react";

/* ============================================================
   MENU CONFIG
   ============================================================ */

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Monitoring",
    icon: BarChart3,
    children: [
      {
        label: "Assembly",
        icon: Cog,
        children: [
          {
            label: "Overview",
            href: "/dashboard",
            icon: Gauge,
          },
          {
            label: "TV",
            href: "/tv",
            icon: Tv,
            newTab: true,
          },
        ],
      },
      {
        label: "Moulding",
        icon: Factory,
        children: [
          {
            label: "Overview",
            href: "/monitoring/moulding",
            icon: Gauge,
          },
          {
            label: "TV",
            href: "/tv2",
            icon: Tv,
            newTab: true,
          },
        ],
      },
    ],
  },
  {
    label: "Employees",
    icon: Users,
    children: [
      {
        label: "All Employees",
        href: "/employees",
        icon: Users,
      },
      {
        label: "Create Employee",
        href: "/employees/create",
        icon: UserPlus,
      },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    label: "Activities",
    href: "/activities",
    icon: ClipboardList,
  },
];

const secondaryNavigation = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

/* ============================================================
   ROUTE HELPERS
   ============================================================ */

function isPathActive(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemMatches(item, pathname) {
  if (item.children) {
    return item.children.some((child) => itemMatches(child, pathname));
  }

  if (item.newTab) return false;

  return isPathActive(pathname, item.href);
}

function getActiveGroupKeys(items, pathname, parentKey = "") {
  return items.flatMap((item) => {
    if (!item.children) return [];

    const key = parentKey ? `${parentKey}/${item.label}` : item.label;
    const childKeys = getActiveGroupKeys(item.children, pathname, key);

    return itemMatches(item, pathname) ? [key, ...childKeys] : childKeys;
  });
}

/* ============================================================
   LEVEL STYLES
   ============================================================ */

const LEVEL_STYLES = {
  0: {
    row: "h-11 gap-3 px-3 text-[13px] rounded-xl",
    icon: "h-[18px] w-[18px]",
    box: true,
  },
  1: {
    row: "h-9 gap-2.5 px-3 text-[12.5px] rounded-lg",
    icon: "h-4 w-4",
    box: false,
  },
  2: {
    row: "h-8 gap-2 px-2.5 text-[12px] rounded-lg",
    icon: "h-[15px] w-[15px]",
    box: false,
  },
};

/* ============================================================
   SIDEBAR
   ============================================================ */

export default function AppSidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const [openKeys, setOpenKeys] = useState(() =>
    getActiveGroupKeys(navigation, pathname)
  );

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const tokenPayload = decodeJwtPayload(token);

  const displayName =
    user?.username ||
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    tokenPayload?.username ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  /* ==========================================================
     SIDEBAR WIDTH
     ========================================================== */

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "82px" : "248px"
    );

    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [collapsed]);

  /* ==========================================================
     ACTIVE GROUPS
     ========================================================== */

  useEffect(() => {
    const activeKeys = getActiveGroupKeys(navigation, pathname);

    if (activeKeys.length > 0) {
      setOpenKeys((current) => [
        ...new Set([...current, ...activeKeys]),
      ]);
    }

    setMobileOpen(false);
  }, [pathname]);

  /* ==========================================================
     HANDLERS
     ========================================================== */

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const toggleGroup = (key) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenKeys((current) => [...new Set([...current, key])]);
      return;
    }

    setOpenKeys((current) =>
      current.includes(key)
        ? current.filter((openKey) => openKey !== key)
        : [...current, key]
    );
  };

  const handleLogout = () => {
    if (isLogoutLoading) return;

    setIsLogoutLoading(true);
    logout();

    window.location.href = ROUTES.LOGIN;
  };

  /* ==========================================================
     RENDER NAVIGATION ITEMS
     ========================================================== */

  const renderItems = (items, depth = 0, parentKey = "", visible = true) =>
    items.map((item) => {
      const key = parentKey ? `${parentKey}/${item.label}` : item.label;
      const Icon = item.icon;
      const level = LEVEL_STYLES[Math.min(depth, 2)];
      const active = itemMatches(item, pathname);

      const collapsedLabel =
        depth === 0
          ? collapsed
            ? "lg:w-0 lg:opacity-0"
            : "w-auto opacity-100"
          : "";

      const iconNode = level.box ? (
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            active
              ? "bg-blue-50 text-blue-600"
              : "bg-white/5 text-white group-hover:bg-white/10"
          }`}
        >
          <Icon
            className={`${level.icon} ${
              active ? "text-blue-600" : "text-white"
            }`}
          />
        </div>
      ) : (
        <Icon
          className={`${level.icon} shrink-0 ${
            active ? "text-blue-600" : "text-white"
          }`}
        />
      );

      /* ---------- Expandable group ---------- */

      if (item.children) {
        const open = openKeys.includes(key) && !collapsed;
        const solid = depth === 0 && active && !open;

        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => toggleGroup(key)}
              aria-expanded={open}
              tabIndex={visible ? 0 : -1}
              title={collapsed && depth === 0 ? item.label : undefined}
              className={`group flex w-full items-center text-left font-medium transition-all duration-200 ${
                level.row
              } ${
                depth === 0 && collapsed
                  ? "lg:justify-center lg:px-0"
                  : ""
              } ${
                solid
                  ? "bg-white text-[#123b9e] shadow-lg shadow-blue-950/20"
                  : active
                    ? "bg-white/15 text-white"
                    : "text-blue-50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {solid && level.box ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <Icon className={`${level.icon} text-blue-600`} />
                </div>
              ) : level.box ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10">
                  <Icon
                    className={`${level.icon} ${
                      active ? "text-blue-600" : "text-white"
                    }`}
                  />
                </div>
              ) : (
                <Icon
                  className={`${level.icon} shrink-0 ${
                    active ? "text-blue-600" : "text-white"
                  }`}
                />
              )}

              <span
                className={`flex-1 whitespace-nowrap transition-all duration-300 ${
                  depth === 0
                    ? collapsed
                      ? "lg:w-0 lg:flex-none lg:opacity-0"
                      : "w-auto opacity-100"
                    : ""
                }`}
              >
                {item.label}
              </span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                } ${depth === 0 && collapsed ? "lg:hidden" : ""}`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              } ${collapsed ? "lg:hidden" : ""}`}
            >
              <div className="overflow-hidden">
                <div
                  className={`mt-1 space-y-1 border-l pl-2.5 ${
                    depth === 0
                      ? "ml-[26px] border-white/20"
                      : "ml-[18px] border-white/15"
                  }`}
                >
                  {renderItems(item.children, depth + 1, key, visible && open)}
                </div>
              </div>
            </div>
          </div>
        );
      }

      /* ---------- Normal link ---------- */

      return (
        <Link
          key={key}
          href={item.href}
          onClick={closeMobileSidebar}
          tabIndex={visible ? 0 : -1}
          title={collapsed && depth === 0 ? item.label : undefined}
          target={item.newTab ? "_blank" : undefined}
          rel={item.newTab ? "noopener noreferrer" : undefined}
          className={`group flex items-center font-medium transition-all duration-200 ${
            level.row
          } ${
            depth === 0 && collapsed ? "lg:justify-center lg:px-0" : ""
          } ${
            active
              ? "bg-white text-[#123b9e] shadow-md shadow-blue-950/20"
              : "text-blue-50 hover:bg-white/10 hover:text-white"
          }`}
        >
          {iconNode}

          <span
            className={`whitespace-nowrap transition-all duration-300 ${collapsedLabel}`}
          >
            {item.label}
          </span>

          {item.newTab && (
            <ExternalLink
              className={`ml-auto h-3.5 w-3.5 shrink-0 opacity-70 ${
                depth === 0 && collapsed ? "lg:hidden" : ""
              }`}
              aria-label="Opens in a new tab"
            />
          )}
        </Link>
      );
    });

  /* ============================================================
     JSX
     ============================================================ */

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-[max(12px,env(safe-area-inset-top))] z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-[#123b9e] text-white shadow-lg shadow-blue-950/25 transition-all duration-200 hover:bg-[#087fca] active:scale-95 lg:hidden"
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
      >
        <Menu className="h-5 w-5" strokeWidth={2.5} />
      </button>

      {/* MOBILE BACKDROP */}

      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-[45] bg-slate-950/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#06194a] via-[#123b9e] to-[#087fca] text-white shadow-[10px_0_40px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out ${
          collapsed ? "lg:w-[82px]" : "lg:w-[248px]"
        } ${
          mobileOpen
            ? "w-[280px] translate-x-0"
            : "w-[280px] -translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Background decoration */}

        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

        {/* HEADER */}

        <div className="relative flex h-[84px] shrink-0 items-center border-b border-white/10 px-4">
          <Link
            href="/dashboard"
            onClick={closeMobileSidebar}
            className={`flex min-w-0 items-center transition-all duration-300 ${
              collapsed ? "lg:justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] border border-white/20 bg-white p-1.5 shadow-lg">
              <img
                src="/logo.png"
                alt="ABHIJEET"
                className="h-full w-full rounded-[10px] object-contain"
              />
            </div>

            <div
              className={`min-w-0 overflow-hidden transition-all duration-300 ${
                collapsed
                  ? "lg:w-0 lg:opacity-0"
                  : "w-auto opacity-100"
              }`}
            >
              <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
                ABHIJEET
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[15px] font-bold">
                Smart Monitoring
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[9px] text-blue-100/70">
                Monitoring System
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileSidebar}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition hover:bg-white/15 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="relative flex-1 overflow-y-auto px-3 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Main Menu
          </p>

          <div className="space-y-1.5">{renderItems(navigation)}</div>

          <div className="my-6 h-px bg-white/10" />

          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            System
          </p>

          <div className="space-y-1.5">
            {renderItems(secondaryNavigation)}
          </div>
        </nav>

        {/* USER / LOGOUT */}

        <div className="relative shrink-0 border-t border-white/10 p-3">
          <div className="rounded-xl bg-white/10 p-2">
            <div
              className={`flex items-center ${
                collapsed ? "lg:justify-center" : "gap-3"
              }`}
            >
              <div
                title={collapsed ? displayName : undefined}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-blue-700 shadow-sm"
              >
                {initial}
              </div>

              <div
                className={`min-w-0 overflow-hidden transition-all duration-300 ${
                  collapsed
                    ? "lg:w-0 lg:opacity-0"
                    : "w-auto opacity-100"
                }`}
              >
                <p className="truncate text-[12px] font-semibold text-white">
                  {displayName}
                </p>

                <p className="truncate text-[10px] text-blue-100/70">
                  Smart Monitoring
                </p>
              </div>
            </div>

            {/* LOGOUT: HIDDEN WHEN DESKTOP SIDEBAR IS COLLAPSED */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              title={collapsed ? "Logout" : undefined}
              className={`mt-2 flex h-10 w-full items-center rounded-xl text-red-100 transition hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                collapsed ? "lg:hidden" : "gap-3 px-3"
              }`}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0 text-red-100" />

              <span className="whitespace-nowrap text-[13px] font-medium">
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div className="relative shrink-0 border-t border-white/10 px-3 py-4">
          <div className="rounded-xl bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
            <p className="text-[11px] font-semibold tracking-wide text-white/90">
              © {new Date().getFullYear()} Abhijeet Plastics
            </p>

            <p className="mt-0.5 text-[10px] font-medium text-blue-100/80">
              Private Limited
            </p>

            <div className="mx-auto my-2 h-px w-10 bg-white/20" />

            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-blue-100/60">
              All Rights Reserved
            </p>
          </div>
        </div>

        {/* DESKTOP COLLAPSE BUTTON */}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-[96px] z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-white text-slate-900 shadow-md transition hover:scale-105 hover:bg-slate-100 lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-black" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="h-4 w-4 text-black" strokeWidth={2.5} />
          )}
        </button>
      </aside>
    </>
  );
}
