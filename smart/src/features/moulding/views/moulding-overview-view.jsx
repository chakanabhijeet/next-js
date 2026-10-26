// "use client";

// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import {
//   IMM_MACHINES,
//   useImmViewModel,
// } from "@/features/moulding/view-models/use-imm-view-model";
// import {
//   AlertCircle,
//   Clock3,
//   Factory,
//   Gauge,
//   Layers,
//   RefreshCw,
//   Timer,
//   Wifi,
//   WifiOff,
// } from "lucide-react";

// /* ============================================================
//    SETTINGS
//    ============================================================ */

// // A machine is "running" if its last production event is newer than this.
// const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
// // Allow small clock differences between server and browser.
// const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
// // How often the screen re-checks status even if no new data arrives.
// const STATUS_TICK_MS = 15 * 1000;

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function parseTimestamp(timestamp) {
//   if (!timestamp) return null;
//   const date = new Date(timestamp);
//   return Number.isNaN(date.getTime()) ? null : date;
// }

// function getMachineTimestamp(production) {
//   return production?.productionTime || production?.createdAt || null;
// }

// function formatLastUpdate(production) {
//   const date = parseTimestamp(getMachineTimestamp(production));
//   if (!date) return "—";

//   return date.toLocaleString("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });
// }

// function formatAgo(production, now) {
//   const date = parseTimestamp(getMachineTimestamp(production));
//   if (!date) return null;

//   const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));
//   if (seconds < 60) return `${seconds} sec ago`;

//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes} min ago`;

//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hr ${minutes % 60} min ago`;

//   return `${Math.floor(hours / 24)} d ${hours % 24} hr ago`;
// }

// function getMachineStatus(machine, now) {
//   const production = machine?.data;

//   if (machine?.error || !production) {
//     return machine?.error ? "error" : "loading";
//   }

//   const timestamp = parseTimestamp(getMachineTimestamp(production));
//   if (!timestamp) return "stopped";

//   const age = now - timestamp.getTime();
//   if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

//   return age <= MACHINE_TIMEOUT_MS ? "running" : "stopped";
// }

// function formatNumber(value) {
//   const number = Number(value ?? 0);
//   return Number.isFinite(number) ? number.toLocaleString("en-IN") : "—";
// }

// // 70.282 -> "70.3 sec"
// function formatCycleTime(seconds) {
//   if (seconds === null || seconds === undefined) return "—";

//   const value = Number(seconds);
//   if (!Number.isFinite(value) || value < 0) return "—";

//   return `${value.toFixed(1)} sec`;
// }

// function formatPercent(value) {
//   const number = Number(value ?? 0);
//   return Number.isFinite(number) ? `${number.toFixed(1)}%` : "—";
// }

// function textOrDash(value) {
//   const text = value == null ? "" : String(value).trim();
//   return text === "" ? "—" : text;
// }

// /* ============================================================
//    SMALL UI PIECES
//    ============================================================ */

// function StatusBadge({ status }) {
//   let label = "MACHINE STOPPED";
//   let colors = "bg-rose-100 text-rose-700";
//   let dot = "bg-rose-500";

//   if (status === "running") {
//     label = "RUNNING";
//     colors = "bg-emerald-50 text-emerald-700";
//     dot = "bg-emerald-500";
//   } else if (status === "loading") {
//     label = "LOADING";
//     colors = "bg-slate-100 text-slate-600";
//     dot = "bg-slate-400";
//   } else if (status === "error") {
//     label = "API ERROR";
//     colors = "bg-amber-100 text-amber-800";
//     dot = "bg-amber-500";
//   } else if (status === "time-error") {
//     label = "CHECK TIME";
//     colors = "bg-amber-100 text-amber-800";
//     dot = "bg-amber-500";
//   }

//   return (
//     <span
//       className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${colors}`}
//     >
//       <span className={`h-2 w-2 rounded-full ${dot}`} />
//       {label}
//     </span>
//   );
// }

// // Big number tile (Shift Production, Day Production, Cycle Time)
// function StatTile({ icon: Icon, label, value, sub, stopped }) {
//   return (
//     <div
//       className={`min-w-0 rounded-xl border p-4 ${
//         stopped ? "border-rose-200 bg-rose-100/60" : "border-slate-200 bg-white"
//       }`}
//     >
//       <div className="flex items-center gap-2">
//         <div
//           className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
//             stopped ? "bg-rose-200 text-rose-700" : "bg-violet-50 text-violet-600"
//           }`}
//         >
//           <Icon className="h-4 w-4" />
//         </div>
//         <p
//           className={`min-w-0 truncate text-xs font-semibold uppercase tracking-wide ${
//             stopped ? "text-rose-700" : "text-slate-500"
//           }`}
//         >
//           {label}
//         </p>
//       </div>

//       <p
//         className={`mt-3 break-words text-3xl font-extrabold leading-none tabular-nums sm:text-4xl ${
//           stopped ? "text-rose-700" : "text-violet-600"
//         }`}
//       >
//         {value}
//       </p>

//       <p className="mt-2 min-h-[1rem] truncate text-xs text-slate-500">
//         {sub || " "}
//       </p>
//     </div>
//   );
// }

// // OEE colour by value (full class names so Tailwind keeps them)
// function getOeeColors(value) {
//   if (value >= 85) return { stroke: "stroke-emerald-500", bar: "bg-emerald-500" };
//   if (value >= 60) return { stroke: "stroke-amber-500", bar: "bg-amber-500" };
//   return { stroke: "stroke-orange-500", bar: "bg-orange-500" };
// }

// // Ring gauge for the overall OEE
// function OeeRing({ value, stopped }) {
//   const percent = Math.min(100, Math.max(0, Number(value) || 0));
//   const radius = 52;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference * (1 - percent / 100);
//   const colors = getOeeColors(percent);

//   return (
//     <div className="relative h-36 w-36 shrink-0">
//       <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
//         <circle
//           cx="60"
//           cy="60"
//           r={radius}
//           fill="none"
//           strokeWidth="10"
//           className="stroke-slate-200"
//         />
//         <circle
//           cx="60"
//           cy="60"
//           r={radius}
//           fill="none"
//           strokeWidth="10"
//           strokeLinecap="round"
//           strokeDasharray={circumference}
//           strokeDashoffset={offset}
//           className={`${stopped ? "stroke-rose-400" : colors.stroke} transition-all duration-700`}
//         />
//       </svg>

//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span
//           className={`text-2xl font-extrabold tabular-nums ${
//             stopped ? "text-rose-700" : "text-slate-900"
//           }`}
//         >
//           {percent.toFixed(1)}%
//         </span>
//         <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
//           OEE
//         </span>
//       </div>
//     </div>
//   );
// }

// function OeeBar({ label, value, stopped }) {
//   const percent = Math.min(100, Math.max(0, Number(value) || 0));
//   const colors = getOeeColors(percent);

//   return (
//     <div className="min-w-0">
//       <div className="flex items-center justify-between gap-2 text-sm">
//         <span className="text-slate-600">{label}</span>
//         <span className="font-semibold tabular-nums text-slate-800">
//           {formatPercent(value)}
//         </span>
//       </div>
//       <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
//         <div
//           className={`h-full rounded-full transition-all duration-700 ${
//             stopped ? "bg-rose-400" : colors.bar
//           }`}
//           style={{ width: `${percent}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// function DetailRow({ label, value, stopped }) {
//   return (
//     <div
//       className={`flex min-h-[44px] items-center justify-between gap-3 border-b py-2.5 last:border-b-0 ${
//         stopped ? "border-rose-200" : "border-slate-100"
//       }`}
//     >
//       <span className="text-sm text-slate-500">{label}</span>
//       <span className="min-w-0 break-words text-right text-sm font-semibold text-slate-800">
//         {value}
//       </span>
//     </div>
//   );
// }

// /* ============================================================
//    ONE MACHINE CARD
//    ============================================================ */

// function ImmMachineCard({ config, machine, isRefreshing, now }) {
//   const production = machine?.data ?? null;
//   const error = machine?.error ?? null;
//   const status = getMachineStatus(machine, now);
//   const stopped = status === "stopped" || status === "error";
//   const ago = production ? formatAgo(production, now) : null;

//   return (
//     <section
//       className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm ${
//         stopped ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"
//       }`}
//     >
//       {/* Header */}
//       <header
//         className={`flex min-h-[60px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
//           stopped ? "bg-rose-700" : "bg-indigo-600"
//         }`}
//       >
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
//             <Factory className="h-5 w-5 text-white" />
//           </div>
//           <div className="min-w-0">
//             <h2 className="truncate text-base font-bold leading-tight text-white sm:text-lg">
//               {config.title}
//             </h2>
//             <p className="truncate text-xs text-white/70">
//               Injection Moulding Machine
//             </p>
//           </div>
//         </div>

//         <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
//           {config.tonnage && (
//             <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
//               {config.tonnage}
//             </span>
//           )}
//           <StatusBadge status={status} />
//         </div>
//       </header>

//       {/* Loading / error without data */}
//       {!production ? (
//         <div className="p-5">
//           {status === "loading" ? (
//             <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-500">
//               <RefreshCw className="h-4 w-4 animate-spin" />
//               Loading...
//             </div>
//           ) : (
//             <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <div className="min-w-0">
//                 <p className="font-semibold">Unable to load machine data</p>
//                 <p className="mt-1 break-words">
//                   {typeof error === "string"
//                     ? error
//                     : error?.message || "No production response received."}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-4 p-4 sm:p-5">
//           {status === "time-error" && (
//             <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//               The API timestamp is in the future. Check the backend clock.
//             </div>
//           )}

//           {status === "stopped" && (
//             <div className="break-words rounded-lg border border-rose-200 bg-rose-100 p-3 text-sm text-rose-800">
//               Machine stopped from {formatLastUpdate(production)}
//               {ago ? ` (${ago})` : ""}
//             </div>
//           )}

//           {error && production && (
//             <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <p className="min-w-0 break-words">
//                 Showing the last received data. {String(error)}
//               </p>
//             </div>
//           )}

//           {/* Key numbers */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//             <StatTile
//               icon={Layers}
//               label="Shift Production"
//               value={formatNumber(production.productionCount)}
//               sub={production.shiftName ? `Shift ${production.shiftName}` : ""}
//               stopped={stopped}
//             />
//             <StatTile
//               icon={Factory}
//               label="Day Production"
//               value={formatNumber(production.dayProduction)}
//               sub="Total for today"
//               stopped={stopped}
//             />
//             <StatTile
//               icon={Timer}
//               label="Cycle Time"
//               value={formatCycleTime(production.cycleTimeSec)}
//               sub="Last cycle"
//               stopped={stopped}
//             />
//           </div>

//           {/* OEE + details */}
//           <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//             {/* OEE */}
//             <div
//               className={`min-w-0 rounded-xl border p-4 ${
//                 stopped
//                   ? "border-rose-200 bg-rose-100/60"
//                   : "border-slate-200 bg-white"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <Gauge className="h-4 w-4 text-violet-600" />
//                 <h3 className="text-sm font-bold text-slate-800">
//                   Shift OEE
//                   {production.shiftName ? ` · Shift ${production.shiftName}` : ""}
//                 </h3>
//               </div>

//               <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
//                 <OeeRing value={production.oee.oee} stopped={stopped} />

//                 <div className="w-full min-w-0 flex-1 space-y-3">
//                   <OeeBar
//                     label="Availability"
//                     value={production.oee.availability}
//                     stopped={stopped}
//                   />
//                   <OeeBar
//                     label="Performance"
//                     value={production.oee.performance}
//                     stopped={stopped}
//                   />
//                   <OeeBar
//                     label="Quality"
//                     value={production.oee.quality}
//                     stopped={stopped}
//                   />
//                 </div>
//               </div>

//               <div className="mt-4 flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
//                 <span className="text-slate-500">Day OEE</span>
//                 <span className="font-semibold text-slate-800">
//                   {production.hasDayOee
//                     ? formatPercent(production.dayOee.oee)
//                     : "Not available yet"}
//                 </span>
//               </div>
//             </div>

//             {/* Machine details */}
//             <div
//               className={`min-w-0 rounded-xl border px-4 py-2 ${
//                 stopped
//                   ? "border-rose-200 bg-rose-100/60"
//                   : "border-slate-200 bg-white"
//               }`}
//             >
//               <DetailRow
//                 label="Mould No."
//                 value={textOrDash(production.moldNo)}
//                 stopped={stopped}
//               />
//               <DetailRow
//                 label="Part Name"
//                 value={textOrDash(production.partName)}
//                 stopped={stopped}
//               />
//               <DetailRow
//                 label="Shift"
//                 value={textOrDash(production.shiftName)}
//                 stopped={stopped}
//               />
//               <DetailRow
//                 label="Current Count"
//                 value={formatNumber(production.currentProductionCount)}
//                 stopped={stopped}
//               />

//               <div
//                 className={`my-3 flex min-h-[46px] flex-col gap-1 rounded-lg px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2 ${
//                   stopped ? "bg-rose-200/80" : "bg-violet-50"
//                 }`}
//               >
//                 <span
//                   className={`flex shrink-0 items-center gap-2 text-sm ${
//                     stopped ? "text-rose-800" : "text-violet-700"
//                   }`}
//                 >
//                   <Clock3 className="h-4 w-4" />
//                   Last Update
//                 </span>
//                 <span
//                   className={`min-w-0 break-words text-left text-xs font-bold sm:text-right ${
//                     stopped ? "text-rose-800" : "text-violet-800"
//                   }`}
//                 >
//                   {formatLastUpdate(production)}
//                   {ago && (
//                     <span className="block font-medium opacity-80">{ago}</span>
//                   )}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {isRefreshing && (
//             <p className="text-xs text-slate-400">Refreshing...</p>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

// /* ============================================================
//    VIEW: Injection Moulding Overview
//    ============================================================ */

// export default function MouldingOverviewView() {
//   const { machines, isRefreshing, refresh } = useImmViewModel();

//   // Re-evaluate running/stopped regularly, even when no new data arrives
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
//     return () => clearInterval(id);
//   }, []);

//   const runningCount = IMM_MACHINES.filter(
//     (config) => getMachineStatus(machines?.[config.key], now) === "running"
//   ).length;

//   return (
//     <DashboardLayout>
//       <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 p-3 sm:p-6">
//         <div className="mx-auto w-full max-w-[1800px] min-w-0">
//           <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-5">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 sm:h-12 sm:w-12">
//                 <Factory className="h-5 w-5 text-white sm:h-6 sm:w-6" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
//                   APIPL
//                 </h1>
//                 <p className="text-xs text-slate-500 sm:text-sm">
//                   Injection Moulding Overview
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2 sm:gap-3">
//               <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
//                 {runningCount > 0 ? (
//                   <Wifi className="h-4 w-4 shrink-0 text-emerald-600" />
//                 ) : (
//                   <WifiOff className="h-4 w-4 shrink-0 text-rose-600" />
//                 )}
//                 <span className="whitespace-nowrap">
//                   {runningCount}/{IMM_MACHINES.length} Running
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={refresh}
//                 disabled={isRefreshing}
//                 className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
//               >
//                 <RefreshCw
//                   className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </header>

//           <div className="mb-4">
//             <h2 className="text-base font-bold text-slate-800 sm:text-lg">
//               Injection Moulding
//             </h2>
//             <p className="mt-1 text-xs text-slate-500 sm:text-sm">
//               Live production metrics from the injection moulding machines.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 2xl:grid-cols-2">
//             {IMM_MACHINES.map((config) => (
//               <ImmMachineCard
//                 key={config.key}
//                 config={config}
//                 machine={machines?.[config.key]}
//                 isRefreshing={isRefreshing}
//                 now={now}
//               />
//             ))}
//           </div>

//           <footer className="mt-6 border-t border-slate-200 py-4 text-center text-xs text-slate-400">
//             ABHIJEET Smart Monitoring System
//           </footer>
//         </div>
//       </main>
//     </DashboardLayout>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  IMM_MACHINES,
  useImmViewModel,
} from "@/features/moulding/view-models/use-imm-view-model";
import {
  Activity,
  AlertCircle,
  Clock3,
  Factory,
  Hash,
  Layers,
  RefreshCw,
  Timer,
  Wifi,
  WifiOff,
} from "lucide-react";

/* ============================================================
   SETTINGS
   ============================================================ */

// A machine is "running" if its last production event is newer than this.
const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
// Allow small clock differences between server and browser.
const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
// How often the screen re-checks status even if no new data arrives.
const STATUS_TICK_MS = 15 * 1000;

/* ============================================================
   HELPERS
   ============================================================ */

function parseTimestamp(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getMachineTimestamp(production) {
  return production?.productionTime || production?.createdAt || null;
}

function formatLastUpdate(production) {
  const date = parseTimestamp(getMachineTimestamp(production));
  if (!date) return "—";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatAgo(production, now) {
  const date = parseTimestamp(getMachineTimestamp(production));
  if (!date) return null;

  const seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds} sec ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ${minutes % 60} min ago`;

  return `${Math.floor(hours / 24)} d ${hours % 24} hr ago`;
}

function getMachineStatus(machine, now) {
  const production = machine?.data;

  if (machine?.error || !production) {
    return machine?.error ? "error" : "loading";
  }

  const timestamp = parseTimestamp(getMachineTimestamp(production));
  if (!timestamp) return "stopped";

  const age = now - timestamp.getTime();
  if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

  return age <= MACHINE_TIMEOUT_MS ? "running" : "stopped";
}

function formatNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number.toLocaleString("en-IN") : "—";
}

// Whole seconds only: 70.282 -> "70 sec", 60.6 -> "61 sec"
function formatCycleTime(seconds) {
  if (seconds === null || seconds === undefined) return "—";

  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "—";

  return `${Math.round(value)} sec`;
}

function textOrDash(value) {
  const text = value == null ? "" : String(value).trim();
  return text === "" ? "—" : text;
}

/* ============================================================
   SMALL UI PIECES
   ============================================================ */

function StatusBadge({ status }) {
  let label = "MACHINE STOPPED";
  let colors = "bg-rose-100 text-rose-700";
  let dot = "bg-rose-500";

  if (status === "running") {
    label = "RUNNING";
    colors = "bg-emerald-50 text-emerald-700";
    dot = "bg-emerald-500";
  } else if (status === "loading") {
    label = "LOADING";
    colors = "bg-slate-100 text-slate-600";
    dot = "bg-slate-400";
  } else if (status === "error") {
    label = "API ERROR";
    colors = "bg-amber-100 text-amber-800";
    dot = "bg-amber-500";
  } else if (status === "time-error") {
    label = "CHECK TIME";
    colors = "bg-amber-100 text-amber-800";
    dot = "bg-amber-500";
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${colors}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

// Summary tile at the top of the page (department totals)
function SummaryTile({ icon: Icon, label, value, sub, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 truncate text-2xl font-extrabold tabular-nums text-slate-900">
          {value}
        </p>
        <p className="truncate text-xs text-slate-500">{sub || " "}</p>
      </div>
    </div>
  );
}

// Big number tile inside a machine card
function StatTile({ icon: Icon, label, value, sub, stopped, small = false }) {
  return (
    <div
      className={`flex min-w-0 flex-col justify-between rounded-xl border p-4 ${
        stopped ? "border-rose-200 bg-rose-100/60" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            stopped ? "bg-rose-200 text-rose-700" : "bg-violet-50 text-violet-600"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <p
          className={`min-w-0 truncate text-xs font-semibold uppercase tracking-wide ${
            stopped ? "text-rose-700" : "text-slate-500"
          }`}
        >
          {label}
        </p>
      </div>

      <p
        className={`mt-4 break-words font-extrabold leading-none tabular-nums ${
          small ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
        } ${stopped ? "text-rose-700" : "text-violet-600"}`}
      >
        {value}
      </p>

      <p className="mt-2 min-h-[1rem] truncate text-xs text-slate-500">
        {sub || " "}
      </p>
    </div>
  );
}

/* ============================================================
   ONE MACHINE CARD
   ============================================================ */

function ImmMachineCard({ config, machine, isRefreshing, now }) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = getMachineStatus(machine, now);
  const stopped = status === "stopped" || status === "error";
  const ago = production ? formatAgo(production, now) : null;

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm ${
        stopped ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"
      }`}
    >
      {/* Header */}
      <header
        className={`flex min-h-[64px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
          stopped ? "bg-rose-700" : "bg-indigo-600"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Factory className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold leading-tight text-white sm:text-lg">
              {config.title}
            </h2>
            <p className="truncate text-xs text-white/70">
              Injection Moulding Machine
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          {config.tonnage && (
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
              {config.tonnage}
            </span>
          )}
          {production?.shiftName && (
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
              SHIFT {production.shiftName}
            </span>
          )}
          <StatusBadge status={status} />
        </div>
      </header>

      {/* Loading / error without data */}
      {!production ? (
        <div className="p-5">
          {status === "loading" ? (
            <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold">Unable to load machine data</p>
                <p className="mt-1 break-words">
                  {typeof error === "string"
                    ? error
                    : error?.message || "No production response received."}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 p-4 sm:p-5">
          {status === "time-error" && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              The API timestamp is in the future. Check the backend clock.
            </div>
          )}

          {status === "stopped" && (
            <div className="break-words rounded-lg border border-rose-200 bg-rose-100 p-3 text-sm text-rose-800">
              Machine stopped from {formatLastUpdate(production)}
              {ago ? ` (${ago})` : ""}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="min-w-0 break-words">
                Showing the last received data. {String(error)}
              </p>
            </div>
          )}

          {/* Key numbers */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              icon={Layers}
              label="Shift Production"
              value={formatNumber(production.productionCount)}
              sub={production.shiftName ? `Shift ${production.shiftName}` : ""}
              stopped={stopped}
            />
            <StatTile
              icon={Factory}
              label="Day Production"
              value={formatNumber(production.dayProduction)}
              sub="Total for today"
              stopped={stopped}
            />
            <StatTile
              icon={Timer}
              label="Cycle Time"
              value={formatCycleTime(production.cycleTimeSec)}
              sub="Last cycle"
              stopped={stopped}
            />
            <StatTile
              icon={Hash}
              label="Mould No."
              value={textOrDash(production.moldNo)}
              sub="Mould in use"
              stopped={stopped}
              small
            />
          </div>

          {/* Last update */}
          <div
            className={`flex min-h-[52px] flex-col gap-1 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${
              stopped ? "bg-rose-200/80" : "bg-violet-50"
            }`}
          >
            <span
              className={`flex shrink-0 items-center gap-2 text-sm font-semibold ${
                stopped ? "text-rose-800" : "text-violet-700"
              }`}
            >
              <Clock3 className="h-4 w-4" />
              Last Update
              {status === "running" && (
                <span className="relative ml-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              )}
            </span>
            <span
              className={`min-w-0 break-words text-left text-sm font-bold sm:text-right ${
                stopped ? "text-rose-800" : "text-violet-800"
              }`}
            >
              {formatLastUpdate(production)}
              {ago && (
                <span className="ml-2 text-xs font-medium opacity-80">
                  ({ago})
                </span>
              )}
            </span>
          </div>

          {isRefreshing && (
            <p className="text-xs text-slate-400">Refreshing...</p>
          )}
        </div>
      )}
    </section>
  );
}

/* ============================================================
   VIEW: Injection Moulding Overview
   ============================================================ */

export default function MouldingOverviewView() {
  const { machines, isRefreshing, refresh } = useImmViewModel();

  // Re-evaluate running/stopped regularly, even when no new data arrives
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const runningCount = IMM_MACHINES.filter(
    (config) => getMachineStatus(machines?.[config.key], now) === "running"
  ).length;

  // Department totals (adds up every machine that has data)
  const totals = IMM_MACHINES.reduce(
    (sum, config) => {
      const data = machines?.[config.key]?.data;

      return {
        shift: sum.shift + Number(data?.productionCount ?? 0),
        day: sum.day + Number(data?.dayProduction ?? 0),
      };
    },
    { shift: 0, day: 0 }
  );

  return (
    <DashboardLayout>
      <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 p-3 sm:p-6">
        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 sm:h-12 sm:w-12">
                <Factory className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">
                  APIPL
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Injection Moulding Overview
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
                {runningCount > 0 ? (
                  <Wifi className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <WifiOff className="h-4 w-4 shrink-0 text-rose-600" />
                )}
                <span className="whitespace-nowrap">
                  {runningCount}/{IMM_MACHINES.length} Running
                </span>
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </header>

          {/* Department summary */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <SummaryTile
              icon={Activity}
              label="Machines Running"
              value={`${runningCount} / ${IMM_MACHINES.length}`}
            
              tone="emerald"
            />
            <SummaryTile
              icon={Layers}
              label="Shift Production"
              value={formatNumber(totals.shift)}
              sub="All machines"
              tone="indigo"
            />
            <SummaryTile
              icon={Factory}
              label="Day Production"
              value={formatNumber(totals.day)}
              sub="All machines"
              tone="violet"
            />
          </div>

          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800 sm:text-lg">
              Injection Moulding Machines
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Live production metrics from the injection moulding machines.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-5">
            {IMM_MACHINES.map((config) => (
              <ImmMachineCard
                key={config.key}
                config={config}

                machine={machines?.[config.key]}
                isRefreshing={isRefreshing}
                now={now}
              />
            ))}
          </div>

          <footer className="mt-6 border-t border-slate-200 py-4 text-center text-xs text-slate-400">
            ABHIJEET Smart Monitoring System
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}