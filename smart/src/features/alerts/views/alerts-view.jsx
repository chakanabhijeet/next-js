// "use client";

// /*
//  * Path: src/features/alerts/views/alerts-view.jsx
//  *
//  * Alerts page: every Assembly and Moulding machine that has been stopped
//  * for more than 15 minutes (see ../config/alerts.config.js).
//  */

// import DashboardLayout from "@/components/layout/dashboard-layout";
// import {
//   AlertTriangle,
//   BellRing,
//   CheckCircle2,
//   Clock3,
//   Cog,
//   Factory,
//   Layers,
//   Radio,
//   RefreshCw,
//   ShieldAlert,
//   WifiOff,
// } from "lucide-react";

// import {
//   AREAS,
//   CRITICAL_AFTER_MS,
//   STOPPED_AFTER_MS,
// } from "../config/alerts.config";
// import { useAlertsViewModel } from "../view-models/use-alerts-view-model";
// import {
//   formatAgo,
//   formatLastUpdate,
//   formatStoppedFor,
// } from "../utils/alert-status";

// const STOPPED_MINUTES = Math.round(STOPPED_AFTER_MS / 60000);
// const CRITICAL_MINUTES = Math.round(CRITICAL_AFTER_MS / 60000);

// const SORT_OPTIONS = [
//   { value: "longest", label: "Stopped longest" },
//   { value: "shortest", label: "Stopped shortest" },
//   { value: "name", label: "Machine name" },
// ];

// /* ============================================================
//    UI PIECES
//    ============================================================ */

// /* SUMMARY TILE (same look as the other dashboards) */

// function SummaryTile({ icon: Icon, label, value, sub, tone = "blue" }) {
//   const tones = {
//     blue: {
//       box: "border-blue-100 from-blue-50 to-white dark:border-blue-400/15 dark:from-blue-500/10 dark:to-slate-900",
//       bar: "bg-blue-600",
//       icon: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
//       value: "text-blue-700 dark:text-white",
//     },
//     green: {
//       box: "border-emerald-100 from-emerald-50 to-white dark:border-emerald-400/15 dark:from-emerald-500/10 dark:to-slate-900",
//       bar: "bg-emerald-500",
//       icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
//       value: "text-emerald-700 dark:text-white",
//     },
//     amber: {
//       box: "border-amber-100 from-amber-50 to-white dark:border-amber-400/15 dark:from-amber-500/10 dark:to-slate-900",
//       bar: "bg-amber-500",
//       icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
//       value: "text-amber-700 dark:text-white",
//     },
//     red: {
//       box: "border-rose-100 from-rose-50 to-white dark:border-rose-400/15 dark:from-rose-500/10 dark:to-slate-900",
//       bar: "bg-rose-600",
//       icon: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
//       value: "text-rose-700 dark:text-white",
//     },
//   }[tone];

//   return (
//     <div
//       className={`relative min-w-0 overflow-hidden rounded-2xl border bg-gradient-to-br px-4 py-4 shadow-sm ${tones.box}`}
//     >
//       <div className={`absolute inset-y-0 left-0 w-1.5 ${tones.bar}`} />

//       <div className="flex items-center gap-3 pl-1.5">
//         <div
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones.icon}`}
//         >
//           <Icon className="h-5 w-5" />
//         </div>

//         <div className="min-w-0">
//           <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300">
//             {label}
//           </p>

//           <p
//             className={`mt-0.5 text-3xl font-extrabold leading-none tabular-nums ${tones.value}`}
//           >
//             {value}
//           </p>
//         </div>
//       </div>

//       {sub && (
//         <p className="mt-2 truncate pl-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
//           {sub}
//         </p>
//       )}
//     </div>
//   );
// }

// /* AREA BADGE */

// function AreaBadge({ area }) {
//   const Icon = area === AREAS.ASSEMBLY ? Cog : Factory;

//   return (
//     <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white ring-1 ring-white/20">
//       <Icon className="h-3 w-3" />
//       {area}
//     </span>
//   );
// }

// /* ONE ALERT CARD */

// function AlertCard({ alert }) {
//   const critical = alert.state === "critical";

//   return (
//     <section
//       className={`min-w-0 overflow-hidden rounded-2xl border shadow-md ${
//         critical
//           ? "border-rose-300 bg-rose-50 shadow-rose-900/10 dark:border-rose-700 dark:bg-rose-950"
//           : "border-amber-300 bg-amber-50/60 shadow-amber-900/10 dark:border-amber-700/70 dark:bg-amber-950/40"
//       } ${alert.isNew ? "ring-4 ring-rose-400/50" : ""}`}
//     >
//       <header
//         className={`flex min-h-[54px] items-center justify-between gap-2 bg-gradient-to-r px-4 py-3 ${
//           critical
//             ? "from-rose-700 to-rose-600 dark:from-rose-800 dark:to-rose-700"
//             : "from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600"
//         }`}
//       >
//         <div className="flex min-w-0 items-center gap-2.5">
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
//             <AlertTriangle className="h-4 w-4 text-white" />
//           </div>

//           <h2 className="min-w-0 truncate text-sm font-semibold text-white sm:text-[15px]">
//             {alert.title}
//           </h2>
//         </div>

//         <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
//           {alert.isNew && (
//             <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-rose-700">
//               NEW
//             </span>
//           )}

//           {alert.badge && (
//             <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white ring-1 ring-white/20">
//               {alert.badge}
//             </span>
//           )}

//           <AreaBadge area={alert.area} />
//         </div>
//       </header>

//       <div className="space-y-2.5 p-3">
//         {/* Big live counter */}

//         <div
//           className={`relative overflow-hidden rounded-xl border px-4 py-3 ${
//             critical
//               ? "border-rose-200 bg-white dark:border-rose-800/70 dark:bg-rose-950/60"
//               : "border-amber-200 bg-white dark:border-amber-700/50 dark:bg-amber-950/40"
//           }`}
//         >
//           <div
//             className={`absolute inset-y-0 left-0 w-1 ${
//               critical ? "bg-rose-600" : "bg-amber-500"
//             }`}
//           />

//           <p
//             className={`flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-widest ${
//               critical
//                 ? "text-rose-700 dark:text-rose-200"
//                 : "text-amber-700 dark:text-amber-200"
//             }`}
//           >
//             <Clock3 className="h-3.5 w-3.5" />
//             {critical ? "Critical · Stopped for" : "Stopped for"}
//           </p>

//           <p
//             className={`mt-1.5 pl-1 text-2xl font-extrabold leading-none tabular-nums sm:text-3xl ${
//               critical
//                 ? "text-rose-600 dark:text-rose-200"
//                 : "text-amber-600 dark:text-amber-200"
//             }`}
//           >
//             {formatStoppedFor(alert.stoppedForMs)}
//           </p>
//         </div>

//         {/* Last update */}

//         <div
//           className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between ${
//             critical
//               ? "bg-rose-100 dark:bg-rose-900/60"
//               : "bg-amber-100 dark:bg-amber-900/40"
//           }`}
//         >
//           <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">
//             Last update
//           </span>

//           <span className="text-xs font-bold text-slate-900 dark:text-white">
//             {formatLastUpdate(alert.lastUpdate)}
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// }

// /* ALL CLEAR (slim banner) */

// function AllClear({ total, isLoading, filteredOut, areaLabel }) {
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
//         <RefreshCw className="h-4 w-4 animate-spin" />
//         Checking machines…
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 py-3.5 dark:border-emerald-500/20 dark:from-emerald-500/10 dark:to-slate-900">
//       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
//         <CheckCircle2 className="h-6 w-6" />
//       </div>

//       <div className="min-w-0">
//         <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-200">
//           {filteredOut ? `No alerts in ${areaLabel}` : "All clear"}
//         </p>

//         <p className="text-xs text-slate-600 dark:text-slate-400">
//           {filteredOut
//             ? "Other areas have active alerts. Choose All to see them."
//             : `No machine has been stopped for more than ${STOPPED_MINUTES} minutes${
//                 total > 0 ? ` · ${total} machines checked` : ""
//               }.`}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    MACHINE STATUS BOARD  (every machine, always visible)
//    ============================================================ */

// const STATE_LOOK = {
//   running: {
//     label: "RUNNING",
//     bar: "bg-emerald-500",
//     card: "border-slate-200 bg-white dark:border-slate-700/80 dark:bg-slate-900",
//     icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
//     chip: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30",
//     dot: "bg-emerald-500",
//     ping: true,
//   },
//   warning: {
//     label: "STOPPED",
//     bar: "bg-amber-500",
//     card: "border-amber-300 bg-amber-50/70 dark:border-amber-700/70 dark:bg-amber-950/40",
//     icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
//     chip: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30",
//     dot: "bg-amber-500",
//   },
//   critical: {
//     label: "CRITICAL",
//     bar: "bg-rose-600",
//     card: "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950",
//     icon: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
//     chip: "bg-rose-100 text-rose-700 ring-rose-300 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-400/30",
//     dot: "bg-rose-600",
//   },
//   "no-data": {
//     label: "NO DATA",
//     bar: "bg-slate-400",
//     card: "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900",
//     icon: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
//     chip: "bg-slate-200 text-slate-700 ring-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:ring-slate-500/40",
//     dot: "bg-slate-400",
//   },
//   "time-error": {
//     label: "CHECK TIME",
//     bar: "bg-amber-500",
//     card: "border-amber-200 bg-amber-50/50 dark:border-amber-700/50 dark:bg-amber-950/30",
//     icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
//     chip: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30",
//     dot: "bg-amber-500",
//   },
//   loading: {
//     label: "LOADING",
//     bar: "bg-slate-300 dark:bg-slate-600",
//     card: "border-slate-200 bg-white dark:border-slate-700/80 dark:bg-slate-900",
//     icon: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
//     chip: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600",
//     dot: "bg-slate-400",
//   },
// };

// function MachineStatusCard({ item, now }) {
//   const look = STATE_LOOK[item.state] ?? STATE_LOOK.loading;
//   const Icon = item.area === AREAS.ASSEMBLY ? Cog : Factory;

//   const subtitle =
//     item.state === "loading"
//       ? "Waiting for data…"
//       : item.state === "no-data"
//         ? "API did not answer"
//         : item.state === "time-error"
//           ? "API time is in the future"
//           : `Updated ${formatAgo(item.lastUpdate, now)}`;

//   return (
//     <div
//       className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border py-3 pl-4 pr-3 shadow-sm ${look.card}`}
//     >
//       <div className={`absolute inset-y-0 left-0 w-1.5 ${look.bar}`} />

//       <div
//         className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${look.icon}`}
//       >
//         <Icon className="h-5 w-5" />
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-center gap-1.5">
//           <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
//             {item.title}
//           </p>

//           {item.badge && (
//             <span className="shrink-0 rounded bg-blue-50 px-1.5 py-px text-[9px] font-bold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/30">
//               {item.badge}
//             </span>
//           )}
//         </div>

//         <p className="mt-0.5 truncate text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
//           {subtitle}
//         </p>
//       </div>

//       <span
//         className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ring-1 ${look.chip}`}
//       >
//         <span className="relative flex h-2 w-2">
//           {look.ping && (
//             <span
//               className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${look.dot}`}
//             />
//           )}
//           <span className={`relative inline-flex h-2 w-2 rounded-full ${look.dot}`} />
//         </span>
//         {look.label}
//       </span>
//     </div>
//   );
// }

// function StatusBoard({ board, now }) {
//   const areas = [AREAS.ASSEMBLY, AREAS.MOULDING]
//     .map((area) => ({
//       area,
//       items: board.filter((item) => item.area === area),
//     }))
//     .filter((group) => group.items.length > 0);

//   return (
//     <div className="space-y-5">
//       {areas.map((group) => {
//         const running = group.items.filter(
//           (item) => item.state === "running"
//         ).length;

//         const Icon = group.area === AREAS.ASSEMBLY ? Cog : Factory;

//         return (
//           <section
//             key={group.area}
//             className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
//           >
//             <div className="mb-3 flex items-center gap-2.5 px-1">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-sm">
//                 <Icon className="h-4 w-4" />
//               </div>

//               <h3 className="text-sm font-bold text-slate-800 dark:text-white">
//                 {group.area}
//               </h3>

//               <span
//                 className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
//                   running === group.items.length
//                     ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
//                     : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200"
//                 }`}
//               >
//                 {running}/{group.items.length} running
//               </span>
//             </div>

//             <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 2xl:grid-cols-3">
//               {group.items.map((item) => (
//                 <MachineStatusCard key={item.id} item={item} now={now} />
//               ))}
//             </div>
//           </section>
//         );
//       })}
//     </div>
//   );
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function AlertsView() {
//   const {
//     alerts,
//     noData,
//     board,
//     now,
//     counts,
//     isRefreshing,
//     refresh,
//     areaFilter,
//     setAreaFilter,
//     sortBy,
//     setSortBy,
//   } = useAlertsViewModel();

//   const hasAlerts = counts.stopped > 0;

//   // The status board is only for quiet times: shown while NO machine is
//   // stopped, hidden as soon as any alert is active.
//   const showBoard = !hasAlerts;

//   const tabs = [
//     { value: "all", label: "All", count: counts.byArea.all },
//     {
//       value: AREAS.ASSEMBLY,
//       label: AREAS.ASSEMBLY,
//       count: counts.byArea[AREAS.ASSEMBLY],
//     },
//     {
//       value: AREAS.MOULDING,
//       label: AREAS.MOULDING,
//       count: counts.byArea[AREAS.MOULDING],
//     },
//   ];

//   return (
//     <DashboardLayout>
//       <main className="alerts-dashboard min-h-screen min-w-0 overflow-x-hidden bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50 p-3 dark:from-blue-950/40 dark:via-slate-950 dark:to-slate-950 sm:p-6">
//         <div className="mx-auto w-full max-w-[1800px] min-w-0">
//           {/* HEADER */}
//           <header className="relative mb-6 flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
//             <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-sky-400 to-blue-700" />

//             <div className="flex min-w-0 items-center gap-3.5">
//               <div
//                 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-12 sm:w-12 ${
//                   hasAlerts
//                     ? "from-rose-500 to-rose-800 shadow-rose-700/30"
//                     : "from-blue-500 to-blue-800 shadow-blue-700/30"
//                 }`}
//               >
//                 <BellRing className="h-5 w-5 text-white sm:h-6 sm:w-6" />
//               </div>

//               <div className="min-w-0">
//                 <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
//                   Machine Alerts
//                 </h1>

//                 <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
//                   Assembly and Moulding machines stopped for more than{" "}
//                   {STOPPED_MINUTES} minutes
//                 </p>
//               </div>
//             </div>

//             <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
//               <div
//                 className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
//                   hasAlerts
//                     ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300"
//                     : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300"
//                 }`}
//               >
//                 <span className="relative flex h-2 w-2">
//                   <span
//                     className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${
//                       hasAlerts ? "bg-rose-500" : "bg-emerald-500"
//                     }`}
//                   />
//                   <span
//                     className={`relative inline-flex h-2 w-2 rounded-full ${
//                       hasAlerts ? "bg-rose-500" : "bg-emerald-500"
//                     }`}
//                   />
//                 </span>

//                 <span className="whitespace-nowrap">
//                   {hasAlerts
//                     ? `${counts.stopped} active alert${
//                         counts.stopped > 1 ? "s" : ""
//                       }`
//                     : "No active alerts"}
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={refresh}
//                 disabled={isRefreshing}
//                 className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
//               >
//                 <RefreshCw
//                   className={`h-3.5 w-3.5 ${
//                     isRefreshing ? "animate-spin" : ""
//                   }`}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </header>

//           {/* SUMMARY */}
//           <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
//             <SummaryTile
//               icon={Layers}
//               label="Machines checked"
//               value={counts.total}
//               sub="Assembly + Moulding"
//               tone="blue"
//             />

//             <SummaryTile
//               icon={CheckCircle2}
//               label="Running"
//               value={counts.running}
//               sub="Data within 15 minutes"
//               tone="green"
//             />

//             <SummaryTile
//               icon={AlertTriangle}
//               label="Stopped"
//               value={counts.stopped}
//               sub={`More than ${STOPPED_MINUTES} minutes`}
//               tone="amber"
//             />

//             <SummaryTile
//               icon={ShieldAlert}
//               label="Critical"
//               value={counts.critical}
//               sub={`More than ${CRITICAL_MINUTES} minutes`}
//               tone="red"
//             />
//           </div>

//           {/* TITLE + FILTERS */}
//           <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
//             <div className="flex items-center gap-3 px-0.5">
//               <span className="h-5 w-1 rounded-full bg-blue-600" />

//               <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 sm:text-[13px]">
//                 Active Alerts
//               </h2>
//             </div>

//             <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 sm:block" />

//             <div className="flex flex-wrap items-center gap-2">
//               <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.value}
//                     type="button"
//                     onClick={() => setAreaFilter(tab.value)}
//                     className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${
//                       areaFilter === tab.value
//                         ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-sm"
//                         : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
//                     }`}
//                   >
//                     {tab.label}

//                     <span
//                       className={`rounded-full px-1.5 text-[10px] font-bold ${
//                         areaFilter === tab.value
//                           ? "bg-white/25 text-white"
//                           : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
//                       }`}
//                     >
//                       {tab.count}
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               <select
//                 value={sortBy}
//                 onChange={(event) => setSortBy(event.target.value)}
//                 aria-label="Sort alerts"
//                 className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
//               >
//                 {SORT_OPTIONS.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* ALERT CARDS */}
//           {alerts.length > 0 ? (
//             <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 sm:gap-5 2xl:grid-cols-3">
//               {alerts.map((alert) => (
//                 <AlertCard key={alert.id} alert={alert} />
//               ))}
//             </div>
//           ) : (
//             <AllClear
//               total={counts.total}
//               isLoading={counts.isLoading}
//               filteredOut={hasAlerts && areaFilter !== "all"}
//               areaLabel={areaFilter}
//             />
//           )}

//           {/* MACHINES WE CANNOT READ */}
//           {hasAlerts && noData.length > 0 && (
//             <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
//               <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-100">
//                 <WifiOff className="h-4 w-4" />
//                 No data from {noData.length} machine
//                 {noData.length > 1 ? "s" : ""}
//               </div>

//               <p className="mt-1 text-xs text-amber-800/90 dark:text-amber-200/80">
//                 The API did not answer for these machines, so we can not tell
//                 if they are running.
//               </p>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 {noData.map((item) => (
//                   <span
//                     key={item.id}
//                     className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-amber-100 dark:ring-amber-500/30"
//                   >
//                     {item.area === AREAS.ASSEMBLY ? (
//                       <Cog className="h-3 w-3" />
//                     ) : (
//                       <Factory className="h-3 w-3" />
//                     )}
//                     {item.title}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* MACHINE STATUS BOARD (only when no machine is stopped) */}
//           {showBoard && (
//             <>
//               <div className="mb-4 mt-8 flex items-center gap-3 px-0.5">
//                 <span className="h-5 w-1 rounded-full bg-blue-600" />

//                 <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 sm:text-[13px]">
//                   Machine Status
//                 </h2>

//                 <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
//                   <Radio className="h-3 w-3" />
//                   LIVE
//                 </span>

//                 <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800" />
//               </div>

//               <StatusBoard board={board} now={now} />
//             </>
//           )}

//           <footer className="mt-8 border-t border-slate-200 py-4 text-center text-xs font-medium text-slate-400 dark:border-slate-800 dark:text-slate-500">
//             ABHIJEET Smart Monitoring System
//           </footer>
//         </div>
//       </main>
//     </DashboardLayout>
//   );
// }























"use client";

/*
 * Path: src/features/alerts/views/alerts-view.jsx
 *
 * Alerts page: every Assembly and Moulding machine that has been stopped
 * for more than 15 minutes (see ../config/alerts.config.js).
 */

import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Cog,
  Factory,
  Layers,
  RefreshCw,
  ShieldAlert,
  WifiOff,
} from "lucide-react";

import {
  AREAS,
  CRITICAL_AFTER_MS,
  STOPPED_AFTER_MS,
} from "../config/alerts.config";
import { useAlertsViewModel } from "../view-models/use-alerts-view-model";
import {
  formatAgo,
  formatLastUpdate,
  formatStoppedFor,
} from "../utils/alert-status";

const STOPPED_MINUTES = Math.round(STOPPED_AFTER_MS / 60000);
const CRITICAL_MINUTES = Math.round(CRITICAL_AFTER_MS / 60000);

const SORT_OPTIONS = [
  { value: "longest", label: "Stopped longest" },
  { value: "shortest", label: "Stopped shortest" },
  { value: "name", label: "Machine name" },
];

/* ============================================================
   UI PIECES
   ============================================================ */

/* SUMMARY TILE (same look as the other dashboards) */

function SummaryTile({ icon: Icon, label, value, sub, tone = "blue" }) {
  const tones = {
    blue: {
      box: "border-blue-100 from-blue-50 to-white dark:border-blue-400/15 dark:from-blue-500/10 dark:to-slate-900",
      bar: "bg-blue-600",
      icon: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
      value: "text-blue-700 dark:text-white",
    },
    green: {
      box: "border-emerald-100 from-emerald-50 to-white dark:border-emerald-400/15 dark:from-emerald-500/10 dark:to-slate-900",
      bar: "bg-emerald-500",
      icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
      value: "text-emerald-700 dark:text-white",
    },
    amber: {
      box: "border-amber-100 from-amber-50 to-white dark:border-amber-400/15 dark:from-amber-500/10 dark:to-slate-900",
      bar: "bg-amber-500",
      icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
      value: "text-amber-700 dark:text-white",
    },
    red: {
      box: "border-rose-100 from-rose-50 to-white dark:border-rose-400/15 dark:from-rose-500/10 dark:to-slate-900",
      bar: "bg-rose-600",
      icon: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
      value: "text-rose-700 dark:text-white",
    },
  }[tone];

  return (
    <div
      className={`relative min-w-0 overflow-hidden rounded-2xl border bg-gradient-to-br px-4 py-4 shadow-sm ${tones.box}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1.5 ${tones.bar}`} />

      <div className="flex items-center gap-3 pl-1.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-300">
            {label}
          </p>

          <p
            className={`mt-0.5 text-3xl font-extrabold leading-none tabular-nums ${tones.value}`}
          >
            {value}
          </p>
        </div>
      </div>

      {sub && (
        <p className="mt-2 truncate pl-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {sub}
        </p>
      )}
    </div>
  );
}

/* AREA BADGE */

function AreaBadge({ area }) {
  const Icon = area === AREAS.ASSEMBLY ? Cog : Factory;

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white ring-1 ring-white/20">
      <Icon className="h-3 w-3" />
      {area}
    </span>
  );
}

/* ONE ALERT CARD */

function AlertCard({ alert }) {
  const critical = alert.state === "critical";

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border shadow-md ${
        critical
          ? "border-rose-300 bg-rose-50 shadow-rose-900/10 dark:border-rose-700 dark:bg-rose-950"
          : "border-amber-300 bg-amber-50/60 shadow-amber-900/10 dark:border-amber-700/70 dark:bg-amber-950/40"
      } ${alert.isNew ? "ring-4 ring-rose-400/50" : ""}`}
    >
      <header
        className={`flex min-h-[54px] items-center justify-between gap-2 bg-gradient-to-r px-4 py-3 ${
          critical
            ? "from-rose-700 to-rose-600 dark:from-rose-800 dark:to-rose-700"
            : "from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>

          <h2 className="min-w-0 truncate text-sm font-semibold text-white sm:text-[15px]">
            {alert.title}
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          {alert.isNew && (
            <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-rose-700">
              NEW
            </span>
          )}

          {alert.badge && (
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white ring-1 ring-white/20">
              {alert.badge}
            </span>
          )}

          <AreaBadge area={alert.area} />
        </div>
      </header>

      <div className="space-y-2.5 p-3">
        {/* Big live counter */}

        <div
          className={`relative overflow-hidden rounded-xl border px-4 py-3 ${
            critical
              ? "border-rose-200 bg-white dark:border-rose-800/70 dark:bg-rose-950/60"
              : "border-amber-200 bg-white dark:border-amber-700/50 dark:bg-amber-950/40"
          }`}
        >
          <div
            className={`absolute inset-y-0 left-0 w-1 ${
              critical ? "bg-rose-600" : "bg-amber-500"
            }`}
          />

          <p
            className={`flex items-center gap-1.5 pl-1 text-[10px] font-bold uppercase tracking-widest ${
              critical
                ? "text-rose-700 dark:text-rose-200"
                : "text-amber-700 dark:text-amber-200"
            }`}
          >
            <Clock3 className="h-3.5 w-3.5" />
            {critical ? "Critical · Stopped for" : "Stopped for"}
          </p>

          <p
            className={`mt-1.5 pl-1 text-2xl font-extrabold leading-none tabular-nums sm:text-3xl ${
              critical
                ? "text-rose-600 dark:text-rose-200"
                : "text-amber-600 dark:text-amber-200"
            }`}
          >
            {formatStoppedFor(alert.stoppedForMs)}
          </p>
        </div>

        {/* Last update */}

        <div
          className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between ${
            critical
              ? "bg-rose-100 dark:bg-rose-900/60"
              : "bg-amber-100 dark:bg-amber-900/40"
          }`}
        >
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-200">
            Last update
          </span>

          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {formatLastUpdate(alert.lastUpdate)}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MACHINE STATUS CARD  (used when an area has no stopped machine)
   ============================================================ */

const STATE_LOOK = {
  running: {
    label: "RUNNING",
    bar: "bg-emerald-500",
    card: "border-slate-200 bg-white dark:border-slate-700/80 dark:bg-slate-900",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
    chip: "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    dot: "bg-emerald-500",
    ping: true,
  },
  warning: {
    label: "STOPPED",
    bar: "bg-amber-500",
    card: "border-amber-300 bg-amber-50/70 dark:border-amber-700/70 dark:bg-amber-950/40",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
    chip: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30",
    dot: "bg-amber-500",
  },
  critical: {
    label: "CRITICAL",
    bar: "bg-rose-600",
    card: "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950",
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
    chip: "bg-rose-100 text-rose-700 ring-rose-300 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-400/30",
    dot: "bg-rose-600",
  },
  "no-data": {
    label: "NO DATA",
    bar: "bg-slate-400",
    card: "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900",
    icon: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    chip: "bg-slate-200 text-slate-700 ring-slate-300 dark:bg-slate-700/60 dark:text-slate-200 dark:ring-slate-500/40",
    dot: "bg-slate-400",
  },
  "time-error": {
    label: "CHECK TIME",
    bar: "bg-amber-500",
    card: "border-amber-200 bg-amber-50/50 dark:border-amber-700/50 dark:bg-amber-950/30",
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
    chip: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30",
    dot: "bg-amber-500",
  },
  loading: {
    label: "LOADING",
    bar: "bg-slate-300 dark:bg-slate-600",
    card: "border-slate-200 bg-white dark:border-slate-700/80 dark:bg-slate-900",
    icon: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    chip: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600",
    dot: "bg-slate-400",
  },
};

function MachineStatusCard({ item, now }) {
  const look = STATE_LOOK[item.state] ?? STATE_LOOK.loading;
  const Icon = item.area === AREAS.ASSEMBLY ? Cog : Factory;

  const subtitle =
    item.state === "loading"
      ? "Waiting for data…"
      : item.state === "no-data"
        ? "API did not answer"
        : item.state === "time-error"
          ? "API time is in the future"
          : `Updated ${formatAgo(item.lastUpdate, now)}`;

  return (
    <div
      className={`relative flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-2xl border-2 py-6 pl-6 pr-5 shadow-md ${look.card}`}
    >
      <div className={`absolute inset-y-0 left-0 w-2 ${look.bar}`} />

      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${look.icon}`}
      >
        <Icon className="h-8 w-8" />
      </div>

      <div className="min-w-0 flex-1 basis-40">
        <div className="flex items-center gap-2">
          <p className="truncate text-xl font-bold text-slate-800 dark:text-white">
            {item.title}
          </p>

          {item.badge && (
            <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-400/30">
              {item.badge}
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      <span
        className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold tracking-wide ring-1 ${look.chip}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          {look.ping && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${look.dot}`}
            />
          )}
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${look.dot}`} />
        </span>
        {look.label}
      </span>
    </div>
  );
}

/* ============================================================
   ONE AREA (Assembly or Moulding)
   Some machine stopped -> show the stopped machines.
   None stopped         -> show every machine of the area as running.
   ============================================================ */

function AreaSection({ section, now, sortBy, setSortBy }) {
  const stoppedCount = section.alerts.length;
  const allRunning = section.running === section.total && section.total > 0;

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-4">
      {/* Status line + sort */}
      <div className="mb-3 flex flex-wrap items-center gap-2.5 px-1">
        {section.hasAlerts ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            {stoppedCount} stopped
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${
              allRunning
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {allRunning && <CheckCircle2 className="h-3.5 w-3.5" />}
            {section.isLoading
              ? "Checking…"
              : allRunning
                ? "All running"
                : "No alerts"}
          </span>
        )}

        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {section.running}/{section.total} running
        </span>

        <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 sm:block" />

        {section.hasAlerts && (
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort stopped machines"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {section.hasAlerts ? (
        <>
          {/* Stopped machines of this area */}
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {section.alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>

          {/* Machines of this area we cannot read */}
          {section.noData.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              <WifiOff className="h-4 w-4 shrink-0" />

              <span className="font-bold">No data from:</span>

              {section.noData.map((item) => (
                <span
                  key={item.id}
                  className="rounded-md bg-white px-2 py-0.5 font-semibold ring-1 ring-amber-200 dark:bg-slate-900 dark:ring-amber-500/30"
                >
                  {item.title}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Nothing stopped: every machine of this area with its running state */
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {section.items.map((item) => (
            <MachineStatusCard key={item.id} item={item} now={now} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   AREA TABS  (Assembly | Moulding)
   ============================================================ */

function AreaTabs({ sections, activeArea, onChange }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {sections.map((item) => {
        const Icon = item.area === AREAS.ASSEMBLY ? Cog : Factory;
        const selected = item.area === activeArea;

        return (
          <button
            key={item.area}
            type="button"
            onClick={() => onChange(item.area)}
            aria-pressed={selected}
            className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left shadow-sm ${
              selected
                ? "border-blue-600 bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md shadow-blue-700/25"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                selected
                  ? "bg-white/20 text-white"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-extrabold">{item.area}</p>

              <p
                className={`truncate text-xs font-medium ${
                  selected
                    ? "text-blue-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.running}/{item.total} running
              </p>
            </div>

            {item.hasAlerts ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                <AlertTriangle className="h-3 w-3" />
                {item.stopped} stopped
              </span>
            ) : (
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  selected
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                {item.isLoading ? "Checking" : "All running"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AlertsView() {
  const {
    sections,
    section,
    activeArea,
    setActiveArea,
    now,
    isRefreshing,
    refresh,
    sortBy,
    setSortBy,
  } = useAlertsViewModel();

  // Everything in the header and tiles follows the open area
  const hasAlerts = section.hasAlerts;
  const AreaIcon = activeArea === AREAS.ASSEMBLY ? Cog : Factory;

  return (
    <DashboardLayout>
      <main className="alerts-dashboard min-h-screen min-w-0 overflow-x-hidden bg-gradient-to-b from-blue-50/80 via-slate-50 to-slate-50 p-3 dark:from-blue-950/40 dark:via-slate-950 dark:to-slate-950 sm:p-6">
        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          {/* HEADER */}
          <header className="relative mb-6 flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-sky-400 to-blue-700" />

            <div className="flex min-w-0 items-center gap-3.5">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-12 sm:w-12 ${
                  hasAlerts
                    ? "from-rose-500 to-rose-800 shadow-rose-700/30"
                    : "from-blue-500 to-blue-800 shadow-blue-700/30"
                }`}
              >
                <AreaIcon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {activeArea} Alerts
                </h1>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                  {activeArea} machines stopped for more than{" "}
                  {STOPPED_MINUTES} minutes
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
              <div
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  hasAlerts
                    ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${
                      hasAlerts ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                      hasAlerts ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                  />
                </span>

                <span className="whitespace-nowrap">
                  {hasAlerts
                    ? `${section.stopped} active alert${
                        section.stopped > 1 ? "s" : ""
                      }`
                    : "No active alerts"}
                </span>
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>
            </div>
          </header>

          {/* AREA TABS */}
          <AreaTabs
            sections={sections}
            activeArea={activeArea}
            onChange={setActiveArea}
          />

          {/* SUMMARY */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <SummaryTile
              icon={Layers}
              label="Machines checked"
              value={section.total}
              sub={`${activeArea} machines`}
              tone="blue"
            />

            <SummaryTile
              icon={CheckCircle2}
              label="Running"
              value={section.running}
              sub="Data within 15 minutes"
              tone="green"
            />

            <SummaryTile
              icon={AlertTriangle}
              label="Stopped"
              value={section.stopped}
              sub={`More than ${STOPPED_MINUTES} minutes`}
              tone="amber"
            />

            <SummaryTile
              icon={ShieldAlert}
              label="Critical"
              value={section.critical}
              sub={`More than ${CRITICAL_MINUTES} minutes`}
              tone="red"
            />
          </div>

          {/* SELECTED AREA */}
          <AreaSection
            section={section}
            now={now}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <footer className="mt-8 border-t border-slate-200 py-4 text-center text-xs font-medium text-slate-400 dark:border-slate-800 dark:text-slate-500">
            ABHIJEET Smart Monitoring System
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}