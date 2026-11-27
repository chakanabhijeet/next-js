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
            href: "/monitoring/assembly",
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

/*
 * Sidebar size is remembered only while you move between pages.
 * It lives outside the component, so opening another page keeps the same
 * size (no small -> big flash). It is NOT saved anywhere, so after login
 * or a browser reload the sidebar always starts small.
 */
let sidebarCollapsedCache = true; // true = small (default)

/* ============================================================
   LEVEL STYLES
   ============================================================ */

const LEVEL_STYLES = {
  0: {
    row: "min-h-[44px] gap-3 px-2.5 text-[13px] rounded-xl",
    icon: "h-[18px] w-[18px]",
    box: true,
  },
  1: {
    row: "min-h-[38px] gap-2.5 px-3 text-[12.5px] rounded-lg",
    icon: "h-4 w-4",
    box: false,
  },
  2: {
    row: "min-h-[34px] gap-2 px-2.5 text-[12px] rounded-lg",
    icon: "h-[15px] w-[15px]",
    box: false,
  },
};

/* Row colours: one place for every active / idle state.
   Top-level active item = solid white pill. Sub-items = soft white tint. */

function isSolid(active, open, depth) {
  return active && !open && depth === 0;
}

function rowTone(active, open, depth) {
  if (isSolid(active, open, depth)) {
    return "bg-white text-[#123b9e] shadow-lg shadow-blue-950/30";
  }

  if (active) {
    return "bg-white/15 text-white";
  }

  return "text-blue-50 hover:bg-white/10 hover:text-white";
}

function iconBoxTone(active, solid) {
  if (solid) return "bg-blue-50 text-blue-600";

  return active
    ? "bg-white/20 text-white"
    : "bg-white/10 text-white group-hover:bg-white/20";
}

function plainIconTone(active) {
  return active
    ? "text-cyan-300"
    : "text-blue-100/80 group-hover:text-white";
}

/* ============================================================
   SIDEBAR
   ============================================================ */

export default function AppSidebar() {
  const pathname = usePathname();

  // Starts small after login / reload. Once you open it, it stays open on
  // every page until you make it small again.
  const [collapsed, setCollapsed] = useState(() => sidebarCollapsedCache);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const [openKeys, setOpenKeys] = useState(() =>
    getActiveGroupKeys(navigation, pathname)
  );

  // The phone drawer is always shown full-size; "small" only applies on desktop.
  const compact = collapsed && !mobileOpen;

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

  const toggleCollapsed = () => {
    const next = !collapsed;

    sidebarCollapsedCache = next;
    setCollapsed(next);
  };

  /* ==========================================================
     SIDEBAR WIDTH
     ========================================================== */

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "82px" : "248px"
    );
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
    if (compact) {
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
    sidebarCollapsedCache = true; // next login starts small
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

      const compactLabel =
        depth === 0
          ? compact
            ? "lg:w-0 lg:opacity-0"
            : "w-auto opacity-100"
          : "";

      const solid = isSolid(active, false, depth);

      /* Small blue bar on the left edge of an active sub-item */

      const marker =
        active && depth > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -left-[13px] top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]"
          />
        ) : null;

      const makeIcon = (isSolidRow) =>
        level.box ? (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${iconBoxTone(
              active,
              isSolidRow
            )}`}
          >
            <Icon className={level.icon} />
          </div>
        ) : (
          <Icon
            className={`${level.icon} shrink-0 transition-colors ${plainIconTone(
              active
            )}`}
          />
        );

      /* ---------- Expandable group ---------- */

      if (item.children) {
        const open = openKeys.includes(key) && !compact;
        const groupSolid = isSolid(active, open, depth);

        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => toggleGroup(key)}
              aria-expanded={open}
              tabIndex={visible ? 0 : -1}
              title={compact && depth === 0 ? item.label : undefined}
              className={`group relative flex w-full items-center text-left font-medium transition-all duration-200 ${
                level.row
              } ${
                depth === 0 && compact
                  ? "lg:justify-center lg:px-0"
                  : ""
              } ${rowTone(active, open, depth)}`}
            >
              {marker}

              {makeIcon(groupSolid)}

              <span
                className={`flex-1 whitespace-nowrap transition-all duration-300 ${
                  depth === 0
                    ? compact
                      ? "lg:w-0 lg:flex-none lg:opacity-0"
                      : "w-auto opacity-100"
                    : ""
                }`}
              >
                {item.label}
              </span>

              <ChevronDown
                className={`h-4 w-4 shrink-0 opacity-60 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                } ${depth === 0 && compact ? "lg:hidden" : ""}`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              } ${compact ? "lg:hidden" : ""}`}
            >
              <div className="overflow-hidden">
                <div
                  className={`mt-1 space-y-0.5 border-l pl-3 ${
                    depth === 0
                      ? "ml-[25px] border-white/20"
                      : "ml-[16px] border-white/15"
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
          title={compact && depth === 0 ? item.label : undefined}
          target={item.newTab ? "_blank" : undefined}
          rel={item.newTab ? "noopener noreferrer" : undefined}
          className={`group relative flex items-center font-medium transition-all duration-200 ${
            level.row
          } ${
            depth === 0 && compact ? "lg:justify-center lg:px-0" : ""
          } ${rowTone(active, false, depth)} ${active ? "font-semibold" : ""}`}
        >
          {marker}

          {makeIcon(solid)}

          <span
            className={`whitespace-nowrap transition-all duration-300 ${compactLabel}`}
          >
            {item.label}
          </span>

          {item.newTab && (
            <ExternalLink
              className={`ml-auto h-3.5 w-3.5 shrink-0 opacity-50 transition group-hover:opacity-100 ${
                depth === 0 && compact ? "lg:hidden" : ""
              }`}
              aria-label="Opens in a new tab"
            />
          )}
        </Link>
      );
    });

  /* Small section title */

  const sectionTitle = (text) => (
    <p
      className={`mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/70 ${
        compact ? "lg:hidden" : ""
      }`}
    >
      {text}
    </p>
  );

  /* ============================================================
     JSX
     ============================================================ */

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-[max(12px,env(safe-area-inset-top))] z-[60] flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-95 lg:hidden"
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
          className="fixed inset-0 z-[45] bg-slate-950/50 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#06194a] via-[#123b9e] to-[#087fca] text-white shadow-[10px_0_40px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out ${
          compact ? "lg:w-[82px]" : "lg:w-[248px]"
        } ${
          mobileOpen
            ? "w-[280px] translate-x-0"
            : "w-[280px] -translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Background glow */}

        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-400/25 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl" />

        {/* Accent line on top */}

        <div className="relative h-1 w-full shrink-0 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-300" />

        {/* HEADER */}

        <div
          className={`relative flex h-[96px] shrink-0 items-center border-b border-white/10 px-3.5 ${
            compact ? "lg:px-[14px]" : ""
          }`}
        >
          <Link
            href="/dashboard"
            onClick={closeMobileSidebar}
            className={`flex min-w-0 items-center transition-all duration-300 ${
              compact ? "lg:justify-center" : "gap-3"
            }`}
          >
            <div
              className={`flex shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white p-1 shadow-lg shadow-blue-950/40 ring-2 ring-white/30 transition-all duration-300 ${
                compact
                  ? "h-[56px] w-[56px] lg:h-[52px] lg:w-[52px]"
                  : "h-[56px] w-[56px]"
              }`}
            >
              <img
                src="/logo.png"
                alt="ABHIJEET"
                className="h-full w-full object-contain"
              />
            </div>

            <div
              className={`min-w-0 transition-all duration-300 ${
                compact
                  ? "lg:w-0 lg:overflow-hidden lg:opacity-0"
                  : "w-auto opacity-100"
              }`}
            >
              <p className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                ABHIJEET
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[15.5px] font-bold leading-tight tracking-tight text-white">
                Smart Monitoring
              </p>

              <p className="mt-0.5 whitespace-nowrap text-[9px] uppercase tracking-wider text-blue-100/70">
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
          {sectionTitle("Main Menu")}

          <div className="space-y-1">{renderItems(navigation)}</div>

          <div className="my-5 h-px bg-white/10" />

          {sectionTitle("System")}

          <div className="space-y-1">
            {renderItems(secondaryNavigation)}
          </div>
        </nav>

        {/* USER / LOGOUT */}

        <div className="relative shrink-0 border-t border-white/10 p-3">
          <div
            className={`flex items-center rounded-2xl border border-white/15 bg-white/10 p-2.5 ${
              compact
                ? "lg:flex-col lg:gap-1.5 lg:border-0 lg:bg-transparent lg:p-0"
                : "gap-3"
            }`}
          >
            <div
              title={displayName}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-400 text-[17px] font-bold text-[#06194a] shadow-md shadow-blue-950/40"
            >
              {initial}

              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#123b9e] bg-emerald-400" />
            </div>

            {/* Full name block (sidebar open) */}

            <div
              className={`min-w-0 flex-1 ${
                compact ? "lg:hidden" : ""
              }`}
            >
              <p
                title={displayName}
                className="break-words text-[13.5px] font-bold leading-tight text-white"
              >
                {displayName}
              </p>

              <p className="mt-1 truncate text-[11px] font-medium text-blue-100/70">
                Signed in
              </p>
            </div>

            {/* SIGN OUT: beside the name when open, below the avatar when small */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              title={isLogoutLoading ? "Signing out..." : "Sign out"}
              aria-label="Sign out"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-200 transition hover:bg-red-500/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                compact
                  ? "lg:h-10 lg:w-10 lg:bg-red-500/20"
                  : ""
              }`}
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div className="relative shrink-0 border-t border-white/10 px-4 py-3 text-center">
          <p
            className={`text-[10.5px] font-semibold text-white/90 ${
              compact ? "lg:hidden" : ""
            }`}
          >
            © {new Date().getFullYear()} Abhijeet Plastics Pvt. Ltd.
          </p>

          <p
            className={`mt-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-blue-100/60 ${
              compact ? "lg:hidden" : ""
            }`}
          >
            All Rights Reserved
          </p>

          <p
            className={`hidden text-[10px] font-semibold text-white/70 ${
              compact ? "lg:block" : ""
            }`}
          >
            ©{String(new Date().getFullYear()).slice(2)}
          </p>
        </div>

        {/* DESKTOP COLLAPSE BUTTON */}

        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-[116px] z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-cyan-200/60 bg-white text-[#123b9e] shadow-lg transition hover:scale-110 hover:bg-cyan-50 lg:flex"
          aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
        >
          {compact ? (
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          )}
        </button>
      </aside>
    </>
  );
}