
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import { useAuthStore } from "@/features/auth/store/auth.store";
// import { decodeJwtPayload } from "@/lib/jwt";
// import { ROUTES } from "@/constants/routes";

// import {
//   BarChart3,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ClipboardList,
//   Cog,
//   ExternalLink,
//   Factory,
//   FileText,
//   Gauge,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   Settings,
//   Tv,
//   Users,
//   X,
// } from "lucide-react";

// /*
//  * MENU CONFIG
//  *
//  *  - An item with `children` becomes an expandable group (any depth).
//  *  - `newTab: true` opens the link in a new browser tab (used for the TV
//  *    screens, which have no sidebar and run full screen on a TV).
//  *
//  * To add another department later, add one more group inside Monitoring:
//  *   { label: "Painting", icon: Paintbrush, children: [ ...Overview, ...TV ] }
//  */
// const navigation = [
//   {
//     label: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Monitoring",
//     icon: BarChart3,
//     children: [
//       {
//         label: "Assembly",
//         icon: Cog,
//         children: [
//           {
//             label: "Overview",
//             href: "/monitoring/assembly",
//             icon: Gauge,
//           },
//           {
//             // Existing TV page (src/app/tv)
//             label: "TV",
//             href: "/tv",
//             icon: Tv,
//             newTab: true,
//           },
//         ],
//       },
//       {
//         label: "Moulding",
//         icon: Factory,
//         children: [
//           {
//             label: "Overview",
//             href: "/monitoring/moulding",
//             icon: Gauge,
//           },
//           {
//             // Moulding TV page (build it at src/app/tv/moulding)
//             label: "TV",
//             href: "/tv/moulding",
//             icon: Tv,
//             newTab: true,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Employees",
//     href: "/employees",
//     icon: Users,
//   },
//   {
//     label: "Reports",
//     href: "/reports",
//     icon: FileText,
//   },
//   {
//     label: "Activities",
//     href: "/activities",
//     icon: ClipboardList,
//   },
// ];

// const secondaryNavigation = [
//   {
//     label: "Settings",
//     href: "/settings",
//     icon: Settings,
//   },
// ];

// // Is this route (or anything under it) the current page?
// function isPathActive(pathname, href) {
//   if (href === "/dashboard") {
//     return pathname === "/dashboard";
//   }

//   return pathname === href || pathname.startsWith(`${href}/`);
// }

// // A leaf is active on its own route. A group is active when any child is.
// // New-tab links (TV) never count as the current page of this layout.
// function itemMatches(item, pathname) {
//   if (item.children) {
//     return item.children.some((child) => itemMatches(child, pathname));
//   }

//   if (item.newTab) return false;

//   return isPathActive(pathname, item.href);
// }

// // Keys of every group that contains the current page (so they start open).
// function getActiveGroupKeys(items, pathname, parentKey = "") {
//   return items.flatMap((item) => {
//     if (!item.children) return [];

//     const key = parentKey ? `${parentKey}/${item.label}` : item.label;
//     const childKeys = getActiveGroupKeys(item.children, pathname, key);

//     return itemMatches(item, pathname) ? [key, ...childKeys] : childKeys;
//   });
// }

// /*
//  * Look of each nesting level:
//  *   0 = main menu rows, 1 = departments, 2 = items inside a department
//  */
// const LEVEL_STYLES = {
//   0: {
//     row: "h-11 gap-3 px-3 text-[13px] rounded-xl",
//     icon: "h-[18px] w-[18px]",
//     box: true,
//   },
//   1: {
//     row: "h-9 gap-2.5 px-3 text-[12.5px] rounded-lg",
//     icon: "h-4 w-4",
//     box: false,
//   },
//   2: {
//     row: "h-8 gap-2 px-2.5 text-[12px] rounded-lg",
//     icon: "h-[15px] w-[15px]",
//     box: false,
//   },
// };

// export default function AppSidebar() {
//   const pathname = usePathname();

//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [isLogoutLoading, setIsLogoutLoading] = useState(false);

//   // Keys of the groups that are expanded, e.g. "Monitoring",
//   // "Monitoring/Assembly". Starts with the groups that hold the current page.
//   const [openKeys, setOpenKeys] = useState(() =>
//     getActiveGroupKeys(navigation, pathname)
//   );

//   /*
//    * Logged-in user (from the auth store).
//    * Falls back to the username inside the token if the
//    * user object has no name.
//    */
//   const user = useAuthStore((state) => state.user);
//   const token = useAuthStore((state) => state.token);
//   const logout = useAuthStore((state) => state.logout);

//   const tokenPayload = decodeJwtPayload(token);

//   const displayName =
//     user?.username ||
//     user?.name ||
//     user?.full_name ||
//     user?.fullName ||
//     tokenPayload?.username ||
//     "User";

//   const initial = displayName.charAt(0).toUpperCase();

//   /*
//    * Keep dashboard content width synchronized
//    * with the sidebar width.
//    */
//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       "--sidebar-width",
//       collapsed ? "82px" : "248px"
//     );

//     return () => {
//       document.documentElement.style.removeProperty("--sidebar-width");
//     };
//   }, [collapsed]);

//   // When you navigate to a page inside a group (link, back button, etc.),
//   // make sure the groups holding it are open.
//   useEffect(() => {
//     const activeKeys = getActiveGroupKeys(navigation, pathname);

//     if (activeKeys.length > 0) {
//       setOpenKeys((current) => [...new Set([...current, ...activeKeys])]);
//     }
//   }, [pathname]);

//   const closeMobileSidebar = () => {
//     setMobileOpen(false);
//   };

//   const toggleGroup = (key) => {
//     // In the collapsed (icon-only) sidebar there is no room for sub-items,
//     // so clicking a group expands the sidebar and opens it.
//     if (collapsed) {
//       setCollapsed(false);
//       setOpenKeys((current) => [...new Set([...current, key])]);
//       return;
//     }

//     setOpenKeys((current) =>
//       current.includes(key)
//         ? current.filter((openKey) => openKey !== key)
//         : [...current, key]
//     );
//   };

//   const handleLogout = () => {
//     if (isLogoutLoading) return;

//     setIsLogoutLoading(true);

//     // Removes the saved login (store + localStorage)
//     logout();

//     // Full reload so nothing from this session stays in memory
//     window.location.href = ROUTES.LOGIN;
//   };

//   /*
//    * Draws a list of menu items. Calls itself for the children of a group,
//    * so any depth works.
//    *   depth   = 0 main menu, 1 department, 2 item inside a department
//    *   visible = false while the parent group is closed (keeps Tab focus out)
//    */
//   const renderItems = (items, depth = 0, parentKey = "", visible = true) =>
//     items.map((item) => {
//       const key = parentKey ? `${parentKey}/${item.label}` : item.label;
//       const Icon = item.icon;
//       const level = LEVEL_STYLES[Math.min(depth, 2)];
//       const active = itemMatches(item, pathname);

//       // Label hides in the collapsed (icon-only) sidebar, main menu only
//       const collapsedLabel =
//         depth === 0
//           ? collapsed
//             ? "lg:w-0 lg:opacity-0"
//             : "w-auto opacity-100"
//           : "";

//       const iconNode = level.box ? (
//         <div
//           className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
//             active ? "bg-blue-50" : "bg-white/5 group-hover:bg-white/10"
//           }`}
//         >
//           <Icon className={level.icon} />
//         </div>
//       ) : (
//         <Icon className={`${level.icon} shrink-0`} />
//       );

//       /* ---------- Expandable group ---------- */
//       if (item.children) {
//         const open = openKeys.includes(key) && !collapsed;
//         // Main-menu group: full white when closed, so the active child
//         // can stand out when it is open.
//         const solid = depth === 0 && active && !open;

//         return (
//           <div key={key}>
//             <button
//               type="button"
//               onClick={() => toggleGroup(key)}
//               aria-expanded={open}
//               tabIndex={visible ? 0 : -1}
//               title={collapsed && depth === 0 ? item.label : undefined}
//               className={`group flex w-full items-center text-left font-medium transition-all duration-200 ${
//                 level.row
//               } ${
//                 depth === 0 && collapsed ? "lg:justify-center lg:px-0" : ""
//               } ${
//                 solid
//                   ? "bg-white text-[#123b9e] shadow-lg shadow-blue-950/20"
//                   : active
//                     ? "bg-white/15 text-white"
//                     : "text-blue-50 hover:bg-white/10 hover:text-white"
//               }`}
//             >
//               {solid && level.box ? (
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
//                   <Icon className={level.icon} />
//                 </div>
//               ) : level.box ? (
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10">
//                   <Icon className={level.icon} />
//                 </div>
//               ) : (
//                 <Icon className={`${level.icon} shrink-0`} />
//               )}

//               <span
//                 className={`flex-1 whitespace-nowrap transition-all duration-300 ${
//                   depth === 0
//                     ? collapsed
//                       ? "lg:w-0 lg:flex-none lg:opacity-0"
//                       : "w-auto opacity-100"
//                     : ""
//                 }`}
//               >
//                 {item.label}
//               </span>

//               <ChevronDown
//                 className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
//                   open ? "rotate-180" : ""
//                 } ${depth === 0 && collapsed ? "lg:hidden" : ""}`}
//               />
//             </button>

//             {/* Sub-items: smooth open / close */}
//             <div
//               className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
//                 open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//               } ${collapsed ? "lg:hidden" : ""}`}
//             >
//               <div className="overflow-hidden">
//                 <div
//                   className={`mt-1 space-y-1 border-l pl-2.5 ${
//                     depth === 0
//                       ? "ml-[26px] border-white/20"
//                       : "ml-[18px] border-white/15"
//                   }`}
//                 >
//                   {renderItems(item.children, depth + 1, key, visible && open)}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       }

//       /* ---------- Normal link ---------- */
//       return (
//         <Link
//           key={key}
//           href={item.href}
//           onClick={closeMobileSidebar}
//           tabIndex={visible ? 0 : -1}
//           title={collapsed && depth === 0 ? item.label : undefined}
//           // TV screens open in a new tab (they have no sidebar)
//           target={item.newTab ? "_blank" : undefined}
//           rel={item.newTab ? "noopener noreferrer" : undefined}
//           className={`group flex items-center font-medium transition-all duration-200 ${
//             level.row
//           } ${depth === 0 && collapsed ? "lg:justify-center lg:px-0" : ""} ${
//             active
//               ? "bg-white text-[#123b9e] shadow-md shadow-blue-950/20"
//               : "text-blue-50 hover:bg-white/10 hover:text-white"
//           }`}
//         >
//           {iconNode}

//           <span
//             className={`whitespace-nowrap transition-all duration-300 ${collapsedLabel}`}
//           >
//             {item.label}
//           </span>

//           {item.newTab && (
//             <ExternalLink
//               className={`ml-auto h-3.5 w-3.5 shrink-0 opacity-70 ${
//                 depth === 0 && collapsed ? "lg:hidden" : ""
//               }`}
//               aria-label="Opens in a new tab"
//             />
//           )}
//         </Link>
//       );
//     });

//   return (
//     <>
//       {/* =========================================================
//           MOBILE MENU BUTTON
//       ========================================================= */}
//       <button
//         type="button"
//         onClick={() => setMobileOpen(true)}
//         className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#123b9e] text-white shadow-lg transition hover:bg-[#0f3185] lg:hidden"
//         aria-label="Open navigation"
//       >
//         <Menu className="h-5 w-5" />
//       </button>

//       {/* =========================================================
//           MOBILE BACKDROP
//       ========================================================= */}
//       {mobileOpen && (
//         <button
//           type="button"
//           onClick={closeMobileSidebar}
//           className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
//           aria-label="Close navigation"
//         />
//       )}

//       {/* =========================================================
//           SIDEBAR
//           IMPORTANT:
//           - fixed
//           - h-screen
//           - overflow-hidden
//           - NO visible sidebar scrollbar
//       ========================================================= */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-gradient-to-b from-[#06194a] via-[#123b9e] to-[#087fca] text-white shadow-[10px_0_40px_rgba(0,0,0,0.18)] transition-all duration-300 ease-in-out ${
//           collapsed ? "lg:w-[82px]" : "lg:w-[248px]"
//         } ${
//           mobileOpen
//             ? "w-[280px] translate-x-0"
//             : "w-[280px] -translate-x-full"
//         } lg:translate-x-0`}
//       >
//         {/* Background decoration */}
//         <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

//         <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

//         {/* =======================================================
//             HEADER
//         ======================================================= */}
//         <div className="relative flex h-[84px] shrink-0 items-center border-b border-white/10 px-4">
//           <Link
//             href="/dashboard"
//             onClick={closeMobileSidebar}
//             className={`flex min-w-0 items-center transition-all duration-300 ${
//               collapsed ? "lg:justify-center" : "gap-3"
//             }`}
//           >
//             {/* Logo */}
//             <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] bg-white p-1.5 shadow-lg">
//               <img
//                 src="/logo.png"
//                 alt="ABHIJEET"
//                 className="h-full w-full rounded-[10px] object-contain"
//               />
//             </div>

//             {/* Brand */}
//             <div
//               className={`min-w-0 overflow-hidden transition-all duration-300 ${
//                 collapsed
//                   ? "lg:w-0 lg:opacity-0"
//                   : "w-auto opacity-100"
//               }`}
//             >
//               <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
//                 ABHIJEET
//               </p>

//               <p className="mt-0.5 whitespace-nowrap text-[15px] font-bold">
//                 Smart Monitoring
//               </p>

//               <p className="mt-0.5 whitespace-nowrap text-[9px] text-blue-100/70">
//                 Monitoring System
//               </p>
//             </div>
//           </Link>

//           {/* Mobile close */}
//           <button
//             type="button"
//             onClick={closeMobileSidebar}
//             className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-blue-100 transition hover:bg-white/10 lg:hidden"
//             aria-label="Close navigation"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* =======================================================
//             NAVIGATION

//             The scrollbar is hidden, but the menu can still scroll
//             on a short screen when groups are open, so nothing is
//             ever cut off.
//         ======================================================= */}
//         <nav className="relative flex-1 overflow-y-auto px-3 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {/* Main menu */}
//           <p
//             className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
//               collapsed ? "lg:hidden" : ""
//             }`}
//           >
//             Main Menu
//           </p>

//           <div className="space-y-1.5">{renderItems(navigation)}</div>

//           {/* Divider */}
//           <div className="my-6 h-px bg-white/10" />

//           {/* System */}
//           <p
//             className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
//               collapsed ? "lg:hidden" : ""
//             }`}
//           >
//             System
//           </p>

//           <div className="space-y-1.5">{renderItems(secondaryNavigation)}</div>
//         </nav>

//         {/* =======================================================
//             USER / LOGOUT
//         ======================================================= */}
//         <div className="relative shrink-0 border-t border-white/10 p-3">
//           <div className="rounded-xl bg-white/10 p-2">
//             <div
//               className={`flex items-center ${
//                 collapsed ? "lg:justify-center" : "gap-3"
//               }`}
//             >
//               <div
//                 title={collapsed ? displayName : undefined}
//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-blue-700 shadow-sm"
//               >
//                 {initial}
//               </div>

//               <div
//                 className={`min-w-0 overflow-hidden transition-all duration-300 ${
//                   collapsed
//                     ? "lg:w-0 lg:opacity-0"
//                     : "w-auto opacity-100"
//                 }`}
//               >
//                 <p className="truncate text-[12px] font-semibold text-white">
//                   {displayName}
//                 </p>

//                 <p className="truncate text-[10px] text-blue-100/70">
//                   Smart Monitoring
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleLogout}
//               disabled={isLogoutLoading}
//               title={collapsed ? "Logout" : undefined}
//               className={`mt-2 flex h-10 w-full items-center rounded-xl text-red-100 transition hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 ${
//                 collapsed
//                   ? "lg:justify-center"
//                   : "gap-3 px-3"
//               }`}
//             >
//               <LogOut className="h-[18px] w-[18px] shrink-0" />

//               <span
//                 className={`whitespace-nowrap text-[13px] font-medium transition-all duration-300 ${
//                   collapsed
//                     ? "lg:w-0 lg:opacity-0"
//                     : "w-auto opacity-100"
//                 }`}
//               >
//                 {isLogoutLoading ? "Logging out..." : "Logout"}
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* =======================================================
//             COPYRIGHT
//         ======================================================= */}
//         <div className="relative shrink-0 border-t border-white/10 px-3 py-4">
//           <div className="rounded-xl bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
//             <p className="text-[11px] font-semibold tracking-wide text-white/90">
//               © {new Date().getFullYear()} Abhijeet Plastics
//             </p>

//             <p className="mt-0.5 text-[10px] font-medium text-blue-100/80">
//               Private Limited
//             </p>

//             <div className="mx-auto my-2 h-px w-10 bg-white/20" />

//             <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-blue-100/60">
//               All Rights Reserved
//             </p>
//           </div>
//         </div>

//         {/* =======================================================
//             DESKTOP COLLAPSE BUTTON
//         ======================================================= */}
//         <button
//           type="button"
//           onClick={() => setCollapsed((value) => !value)}
//           className="absolute -right-3 top-[96px] z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-md transition hover:scale-105 lg:flex"
//           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {collapsed ? (
//             <ChevronRight className="h-4 w-4" />
//           ) : (
//             <ChevronLeft className="h-4 w-4" />
//           )}
//         </button>
//       </aside>
//     </>
//   );
// }





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
  X,
} from "lucide-react";

/*
 * MENU CONFIG
 *
 *  - An item with `children` becomes an expandable group (any depth).
 *  - `newTab: true` opens the link in a new browser tab (used for the TV
 *    screens, which have no sidebar and run full screen on a TV).
 *
 * To add another department later, add one more group inside Monitoring:
 *   { label: "Painting", icon: Paintbrush, children: [ ...Overview, ...TV ] }
 */
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
            // Assembly overview = the existing assembly dashboard
            label: "Overview",
            href: "/dashboard",
            icon: Gauge,
          },
          {
            // Existing TV page (src/app/tv)
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
            // Moulding TV page (build it at src/app/tv/moulding)
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

// Is this route (or anything under it) the current page?
function isPathActive(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

// A leaf is active on its own route. A group is active when any child is.
// New-tab links (TV) never count as the current page of this layout.
function itemMatches(item, pathname) {
  if (item.children) {
    return item.children.some((child) => itemMatches(child, pathname));
  }

  if (item.newTab) return false;

  return isPathActive(pathname, item.href);
}

// Keys of every group that contains the current page (so they start open).
function getActiveGroupKeys(items, pathname, parentKey = "") {
  return items.flatMap((item) => {
    if (!item.children) return [];

    const key = parentKey ? `${parentKey}/${item.label}` : item.label;
    const childKeys = getActiveGroupKeys(item.children, pathname, key);

    return itemMatches(item, pathname) ? [key, ...childKeys] : childKeys;
  });
}

/*
 * Look of each nesting level:
 *   0 = main menu rows, 1 = departments, 2 = items inside a department
 */
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

export default function AppSidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  // Keys of the groups that are expanded, e.g. "Monitoring",
  // "Monitoring/Assembly". Starts with the groups that hold the current page.
  const [openKeys, setOpenKeys] = useState(() =>
    getActiveGroupKeys(navigation, pathname)
  );

  /*
   * Logged-in user (from the auth store).
   * Falls back to the username inside the token if the
   * user object has no name.
   */
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

  // When you navigate to a page inside a group (link, back button, etc.),
  // make sure the groups holding it are open.
  useEffect(() => {
    const activeKeys = getActiveGroupKeys(navigation, pathname);

    if (activeKeys.length > 0) {
      setOpenKeys((current) => [...new Set([...current, ...activeKeys])]);
    }
  }, [pathname]);

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const toggleGroup = (key) => {
    // In the collapsed (icon-only) sidebar there is no room for sub-items,
    // so clicking a group expands the sidebar and opens it.
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

    // Removes the saved login (store + localStorage)
    logout();

    // Full reload so nothing from this session stays in memory
    window.location.href = ROUTES.LOGIN;
  };

  /*
   * Draws a list of menu items. Calls itself for the children of a group,
   * so any depth works.
   *   depth   = 0 main menu, 1 department, 2 item inside a department
   *   visible = false while the parent group is closed (keeps Tab focus out)
   */
  const renderItems = (items, depth = 0, parentKey = "", visible = true) =>
    items.map((item) => {
      const key = parentKey ? `${parentKey}/${item.label}` : item.label;
      const Icon = item.icon;
      const level = LEVEL_STYLES[Math.min(depth, 2)];
      const active = itemMatches(item, pathname);

      // Label hides in the collapsed (icon-only) sidebar, main menu only
      const collapsedLabel =
        depth === 0
          ? collapsed
            ? "lg:w-0 lg:opacity-0"
            : "w-auto opacity-100"
          : "";

      const iconNode = level.box ? (
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            active ? "bg-blue-50" : "bg-white/5 group-hover:bg-white/10"
          }`}
        >
          <Icon className={level.icon} />
        </div>
      ) : (
        <Icon className={`${level.icon} shrink-0`} />
      );

      /* ---------- Expandable group ---------- */
      if (item.children) {
        const open = openKeys.includes(key) && !collapsed;
        // Main-menu group: full white when closed, so the active child
        // can stand out when it is open.
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
                depth === 0 && collapsed ? "lg:justify-center lg:px-0" : ""
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
                  <Icon className={level.icon} />
                </div>
              ) : level.box ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10">
                  <Icon className={level.icon} />
                </div>
              ) : (
                <Icon className={`${level.icon} shrink-0`} />
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

            {/* Sub-items: smooth open / close */}
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
          // TV screens open in a new tab (they have no sidebar)
          target={item.newTab ? "_blank" : undefined}
          rel={item.newTab ? "noopener noreferrer" : undefined}
          className={`group flex items-center font-medium transition-all duration-200 ${
            level.row
          } ${depth === 0 && collapsed ? "lg:justify-center lg:px-0" : ""} ${
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
          - NO visible sidebar scrollbar
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

            The scrollbar is hidden, but the menu can still scroll
            on a short screen when groups are open, so nothing is
            ever cut off.
        ======================================================= */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Main menu */}
          <p
            className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/60 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Main Menu
          </p>

          <div className="space-y-1.5">{renderItems(navigation)}</div>

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

          <div className="space-y-1.5">{renderItems(secondaryNavigation)}</div>
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