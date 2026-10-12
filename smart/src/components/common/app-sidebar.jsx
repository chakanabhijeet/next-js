"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { decodeJwtPayload } from "@/lib/jwt";

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Monitoring",
    href: "/monitoring",
    icon: BarChart3,
  },
  {
    label: "Employees",
    href: "/employees",
    icon: Users,
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
    href: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  /*
   * Logged-in user (from the auth store).
   * Falls back to the username inside the token if the
   * user object has no name.
   */
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const tokenPayload = decodeJwtPayload(token);

  const displayName =
    user?.username ||
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    tokenPayload?.username ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  /*
   * Keep dashboard content width synchronized
   * with the sidebar width.
   */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "82px" : "248px"
    );

    return () => {
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, [collapsed]);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    setIsLogoutLoading(true);

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <>
      {/* =========================================================
          MOBILE MENU BUTTON
      ========================================================= */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#123b9e] text-white shadow-lg transition hover:bg-[#0f3185] lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* =========================================================
          MOBILE BACKDROP
      ========================================================= */}
      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
        />
      )}

      {/* =========================================================
          SIDEBAR
          IMPORTANT:
          - fixed
          - h-screen
          - overflow-hidden
          - NO sidebar scrolling
      ========================================================= */}
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

        {/* =======================================================
            HEADER
        ======================================================= */}
        <div className="relative flex h-[84px] shrink-0 items-center border-b border-white/10 px-4">
          <Link
            href="/dashboard"
            onClick={closeMobileSidebar}
            className={`flex min-w-0 items-center transition-all duration-300 ${
              collapsed ? "lg:justify-center" : "gap-3"
            }`}
          >
            {/* Logo */}
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-white p-1.5 shadow-lg">
              <img
                src="/logo.png"
                alt="ABHIJEET"
                className="h-full w-full rounded-[10px] object-contain"
              />
            </div>

            {/* Brand */}
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

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-100 transition hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =======================================================
            NAVIGATION

            IMPORTANT:
            overflow-hidden means the sidebar itself NEVER gets
            a scrollbar.
        ======================================================= */}
        <nav className="relative flex-1 overflow-hidden px-3 py-5">
          {/* Main menu */}
          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Main Menu
          </p>

          <div className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  title={collapsed ? item.label : undefined}
                  className={`group flex h-11 items-center rounded-xl transition-all duration-200 ${
                    collapsed
                      ? "lg:justify-center lg:px-0"
                      : "gap-3 px-3"
                  } ${
                    active
                      ? "bg-white text-[#123b9e] shadow-lg shadow-blue-950/20"
                      : "text-blue-50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-blue-50"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>

                  <span
                    className={`whitespace-nowrap text-[13px] font-medium transition-all duration-300 ${
                      collapsed
                        ? "lg:w-0 lg:opacity-0"
                        : "w-auto opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-white/10" />

          {/* System */}
          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            System
          </p>

          <div className="space-y-1.5">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  title={collapsed ? item.label : undefined}
                  className={`group flex h-11 items-center rounded-xl transition-all duration-200 ${
                    collapsed
                      ? "lg:justify-center lg:px-0"
                      : "gap-3 px-3"
                  } ${
                    active
                      ? "bg-white text-[#123b9e]"
                      : "text-blue-50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-blue-50"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>

                  <span
                    className={`whitespace-nowrap text-[13px] font-medium transition-all duration-300 ${
                      collapsed
                        ? "lg:w-0 lg:opacity-0"
                        : "w-auto opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* =======================================================
            USER / LOGOUT
        ======================================================= */}
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

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              title={collapsed ? "Logout" : undefined}
              className={`mt-2 flex h-10 w-full items-center rounded-xl text-red-100 transition hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                collapsed
                  ? "lg:justify-center"
                  : "gap-3 px-3"
              }`}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />

              <span
                className={`whitespace-nowrap text-[13px] font-medium transition-all duration-300 ${
                  collapsed
                    ? "lg:w-0 lg:opacity-0"
                    : "w-auto opacity-100"
                }`}
              >
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>

        {/* =======================================================
            COPYRIGHT
        ======================================================= */}
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

        {/* =======================================================
            DESKTOP COLLAPSE BUTTON
        ======================================================= */}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-[96px] z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-md transition hover:scale-105 lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </aside>
    </>
  );
}