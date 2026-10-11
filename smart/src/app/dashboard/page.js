
// "use client";

// import DashboardLayout from "@/components/layout/dashboard-layout";
// import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
// import {
//   RefreshCw,
//   Factory,
//   Activity,
//   Database,
//   Clock3,
//   Gauge,
//   Wifi,
//   WifiOff,
//   AlertCircle,
// } from "lucide-react";

// function formatDate(value) {
//   if (!value) return "—";

//   const date = new Date(value);

//   return Number.isNaN(date.getTime())
//     ? String(value)
//     : date.toLocaleString();
// }

// function formatTime(value) {
//   if (!value) return "—";

//   const date = new Date(value);

//   return Number.isNaN(date.getTime())
//     ? String(value)
//     : date.toLocaleTimeString("en-IN", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
// }

// function formatDuration(seconds) {
//   if (seconds === null || seconds === undefined || seconds === "") {
//     return "—";
//   }

//   const total = Math.max(0, Math.floor(Number(seconds) || 0));
//   const hours = Math.floor(total / 3600);
//   const minutes = Math.floor((total % 3600) / 60);
//   const remainingSeconds = total % 60;

//   if (hours > 0) {
//     return `${hours} hr ${minutes} min ${remainingSeconds} sec`;
//   }

//   if (minutes > 0) {
//     return `${minutes} min ${remainingSeconds} sec`;
//   }

//   return `${remainingSeconds} sec`;
// }

// function MetricRow({ label, value, highlight = false }) {
//   return (
//     <div className="flex min-h-[61px] items-center justify-between gap-4 border-b border-slate-100 px-1 py-3 last:border-b-0">
//       <span className="text-sm font-medium text-slate-500">
//         {label}
//       </span>

//       <span
//         className={`text-right font-semibold ${
//           highlight
//             ? "text-xl tracking-tight text-indigo-600"
//             : "text-sm text-slate-800"
//         }`}
//       >
//         {value ?? "—"}
//       </span>
//     </div>
//   );
// }

// function DataField({ label, value }) {
//   return (
//     <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
//       <p className="text-xs font-medium text-slate-500">{label}</p>
//       <p className="mt-2 break-words text-sm font-semibold text-slate-800">
//         {value === "" || value === null || value === undefined
//           ? "—"
//           : String(value)}
//       </p>
//     </div>
//   );
// }

// function OeeMetric({ label, value }) {
//   const numericValue = Math.max(0, Number(value) || 0);
//   const width = Math.min(100, numericValue);

//   return (
//     <div>
//       <div className="mb-2 flex items-center justify-between gap-3">
//         <span className="text-sm text-slate-500">{label}</span>
//         <span className="text-sm font-bold text-slate-800">
//           {numericValue.toFixed(2)}%
//         </span>
//       </div>

//       <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
//         <div
//           className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
//           style={{ width: `${width}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// function AssemblyCard({ production, isLoading }) {
//   const machineName =
//     production?.station || production?.machineId || "Assembly";

//   return (
//     <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.07)] transition-shadow hover:shadow-lg">
//       <div className="flex min-h-[64px] items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-3">
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
//             <Factory className="h-5 w-5 text-white" />
//           </div>

//           <h2 className="truncate text-lg font-bold text-white sm:text-xl">
//             {machineName}
//           </h2>
//         </div>

//         <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
//           <span
//             className={`h-2.5 w-2.5 rounded-full ${
//               production ? "bg-emerald-300" : "bg-amber-300"
//             }`}
//           />
//           {production ? "CONNECTED" : "WAITING"}
//         </span>
//       </div>

//       <div className="p-5 sm:px-6 sm:py-6">
//         {isLoading && !production && (
//           <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-500">
//             <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
//             Loading production data...
//           </div>
//         )}

//         {production && (
//           <>
//             <MetricRow
//               label="Shift"
//               value={production.shiftName}
//             />

//             <MetricRow
//               label="Shift Production"
//               value={Number(production.productionCount ?? 0).toLocaleString()}
//               highlight
//             />

//             <MetricRow
//               label="Day Production"
//               value={Number(production.dayProduction ?? 0).toLocaleString()}
//               highlight
//             />

//             <MetricRow
//               label="Cycle Time"
//               value={formatDuration(production.cycleTimeSec)}
//             />

//             <div className="mt-3 flex min-h-[50px] items-center justify-between gap-3 rounded-xl bg-indigo-50 px-4 py-3">
//               <span className="flex items-center gap-2 text-sm font-medium text-indigo-700">
//                 <Clock3 className="h-4 w-4" />
//                 Last Update
//               </span>

//               <span className="text-sm font-bold text-indigo-800">
//                 {formatTime(
//                   production.productionTime || production.createdAt
//                 )}
//               </span>
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }

// export default function DashboardPage() {
//   const { production, isLoading, error, refresh } =
//     useProductionViewModel();

//   return (
//     <DashboardLayout>
//       <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 lg:p-8">
//         <div className="mx-auto max-w-[1500px]">
//           <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
//             <div className="flex items-center gap-4">
//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 shadow-md shadow-indigo-200">
//                 <Factory className="h-7 w-7 text-white" />
//               </div>

//               <div>
//                 <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
//                   APIPL
//                 </h1>
//                 <p className="mt-0.5 text-sm text-slate-500">
//                   Assembly Production Dashboard
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <div
//                 className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
//                   production
//                     ? "border-emerald-100 bg-emerald-50 text-emerald-700"
//                     : "border-rose-100 bg-rose-50 text-rose-700"
//                 }`}
//               >
//                 {production ? (
//                   <Wifi className="h-4 w-4" />
//                 ) : (
//                   <WifiOff className="h-4 w-4" />
//                 )}

//                 <span
//                   className={`h-2 w-2 rounded-full ${
//                     production ? "bg-emerald-500" : "bg-rose-500"
//                   }`}
//                 />

//                 {production ? "Connected" : "Disconnected"}
//               </div>

//               <button
//                 type="button"
//                 onClick={refresh}
//                 disabled={isLoading}
//                 className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <RefreshCw
//                   size={16}
//                   className={isLoading ? "animate-spin" : ""}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </header>

//           <div className="mb-5">
//             <h2 className="text-lg font-bold text-slate-800">
//               Assembly Overview
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Live production metrics from your production API.
//             </p>
//           </div>

//           {error && (
//             <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
//               <div>
//                 <p className="font-bold">Production API request failed</p>
//                 <p className="mt-1">{error}</p>
//                 <p className="mt-1">
//                   Check the Bearer token, tenant ID, device ID, and backend
//                   response.
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
//             <AssemblyCard
//               production={production}
//               isLoading={isLoading}
//             />
//           </div>

//           <footer className="mt-8 border-t border-slate-200 py-4 text-center text-xs text-slate-400">
//             ABHIJEET Smart Monitoring System · Assembly Production Dashboard
//           </footer>
//         </div>
//       </main>
//     </DashboardLayout>
//   );
// }





// "use client";

// import DashboardLayout from "@/components/layout/dashboard-layout";
// import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
// import {
//   RefreshCw,
//   Factory,
//   Clock3,
//   Wifi,
//   WifiOff,
//   AlertCircle,
//   ChevronDown,
// } from "lucide-react";

// const MACHINE_TIMEOUT_MS = 5 * 60 * 1000;

// function getMachineTimestamp(production) {
//   return production?.productionTime || production?.createdAt || null;
// }

// function parseApiTimestamp(timestamp) {
//   if (!timestamp) return null;

//   const date = new Date(timestamp);

//   return Number.isNaN(date.getTime()) ? null : date;
// }

// function formatLastUpdate(production) {
//   const timestamp = getMachineTimestamp(production);
//   const date = parseApiTimestamp(timestamp);

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

// function getMachineStatus(machine) {
//   const production = machine?.data;

//   if (machine?.error || !production) {
//     return machine?.error ? "error" : "loading";
//   }

//   const timestamp = parseApiTimestamp(getMachineTimestamp(production));

//   if (!timestamp) return "stopped";

//   const age = Date.now() - timestamp.getTime();

//   if (age < 0) return "time-error";

//   return age <= MACHINE_TIMEOUT_MS ? "running" : "stopped";
// }

// function formatDuration(seconds) {
//   if (seconds === null || seconds === undefined || seconds === "") {
//     return "—";
//   }

//   const value = Number(seconds);

//   if (!Number.isFinite(value) || value < 0) return "—";

//   const total = Math.floor(value);
//   const hours = Math.floor(total / 3600);
//   const minutes = Math.floor((total % 3600) / 60);
//   const remainingSeconds = total % 60;

//   if (hours > 0) {
//     return `${hours} hr ${minutes} min ${remainingSeconds} sec`;
//   }

//   if (minutes > 0) {
//     return `${minutes} min ${remainingSeconds} sec`;
//   }

//   return `${remainingSeconds} sec`;
// }

// function MachineStatus({ status }) {
//   const running = status === "running";
//   const loading = status === "loading";
//   const timeError = status === "time-error";
//   const apiError = status === "error";

//   let label = "MACHINE STOPPED";
//   let colors = "bg-rose-100 text-rose-700";
//   let dot = "bg-rose-500";

//   if (running) {
//     label = "RUNNING";
//     colors = "bg-emerald-50 text-emerald-700";
//     dot = "bg-emerald-500";
//   } else if (loading) {
//     label = "LOADING";
//     colors = "bg-slate-100 text-slate-600";
//     dot = "bg-slate-400";
//   } else if (apiError) {
//     label = "API ERROR";
//     colors = "bg-amber-100 text-amber-800";
//     dot = "bg-amber-500";
//   } else if (timeError) {
//     label = "CHECK TIME";
//     colors = "bg-amber-100 text-amber-800";
//     dot = "bg-amber-500";
//   }

//   return (
//     <span
//       className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${colors}`}
//     >
//       <span className={`h-2 w-2 rounded-full ${dot}`} />
//       {label}
//     </span>
//   );
// }

// function MachineIdentity({ title, production }) {
//   return (
//     <div className="border-b border-slate-100 px-4 py-3">
//       <p className="text-base font-bold text-slate-900">
//         {production?.partName || title}
//       </p>
//       <p className="mt-1 text-sm text-slate-500">
//         Subname: {production?.subname || production?.machineId || "—"}
//       </p>
//       <p className="mt-0.5 text-sm text-slate-500">
//         Station: {production?.station || "—"}
//       </p>
//     </div>
//   );
// }

// function MetricRow({ label, value, stopped, highlight = false }) {
//   return (
//     <div
//       className={`flex min-h-[48px] items-center justify-between gap-3 border-b px-4 py-3 ${
//         stopped ? "border-rose-200" : "border-slate-100"
//       }`}
//     >
//       <span
//         className={`text-sm ${
//           stopped ? "text-rose-700" : "text-slate-500"
//         }`}
//       >
//         {label}
//       </span>
//       <span
//         className={`text-right font-semibold ${
//           highlight
//             ? `text-lg ${stopped ? "text-rose-700" : "text-violet-600"}`
//             : `text-sm ${stopped ? "text-rose-800" : "text-slate-800"}`
//         }`}
//       >
//         {value ?? "—"}
//       </span>
//     </div>
//   );
// }

// function ExtraDetails({ production, stopped }) {
//   const items = [
//     ["Device Name", production?.deviceId],
//     ["Machine ID", production?.machineId],
//     ["Tenant ID", production?.tenantId],
//     ["Customer ID", production?.customerId],
//     ["Event ID", production?.eventId],
//     ["Production Time (UTC)", production?.productionTime],
//     ["Created At (UTC)", production?.createdAt],
//   ];

//   return (
//     <details className="group mt-3">
//       <summary
//         className={`flex cursor-pointer list-none items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium ${
//           stopped
//             ? "border-rose-200 text-rose-700 hover:bg-rose-100"
//             : "border-slate-200 text-slate-600 hover:bg-slate-50"
//         }`}
//       >
//         <span>More details</span>
//         <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
//       </summary>

//       <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
//         {items.map(([label, value]) => (
//           <div
//             key={label}
//             className="min-w-0 rounded-lg border border-slate-200 bg-white p-3"
//           >
//             <p className="text-xs text-slate-500">{label}</p>
//             <p className="mt-1 break-words text-sm font-medium text-slate-800">
//               {value === null || value === undefined || value === ""
//                 ? "—"
//                 : String(value)}
//             </p>
//           </div>
//         ))}
//       </div>
//     </details>
//   );
// }

// function MachineCard({ title, machine, isRefreshing }) {
//   const production = machine?.data ?? null;
//   const error = machine?.error ?? null;
//   const status = getMachineStatus(machine);
//   const stopped = status === "stopped" || status === "error";

//   return (
//     <section
//       className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm ${
//         stopped
//           ? "border-rose-300 bg-rose-50"
//           : "border-slate-200 bg-white"
//       }`}
//     >
//       <header
//         className={`flex min-h-[54px] items-center justify-between gap-2 px-4 py-3 ${
//           stopped ? "bg-rose-700" : "bg-indigo-600"
//         }`}
//       >
//         <div className="flex min-w-0 items-center gap-2">
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
//             <Factory className="h-4 w-4 text-white" />
//           </div>
//           <h2 className="truncate text-base font-bold text-white">{title}</h2>
//         </div>
//         <MachineStatus status={status} />
//       </header>

//       {!production ? (
//         <div className="p-4">
//           {status === "loading" ? (
//             <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-500">
//               <RefreshCw className="h-4 w-4 animate-spin" />
//               Loading...
//             </div>
//           ) : (
//             <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <div>
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
//         <>
//           {status === "time-error" && (
//             <div className="m-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//               The API timestamp is in the future. Check the backend clock.
//             </div>
//           )}

//           {status === "stopped" && (
//             <div className="m-3 rounded-lg border border-rose-200 bg-rose-100 p-3 text-sm text-rose-800">
//               No recent production timestamp received within the configured timeout.
//             </div>
//           )}

//           <MachineIdentity title={title} production={production} />

//           <MetricRow label="Shift" value={production.shiftName} stopped={stopped} />
//           <MetricRow
//             label="Shift Production"
//             value={Number(production.productionCount ?? 0).toLocaleString("en-IN")}
//             highlight
//             stopped={stopped}
//           />
//           <MetricRow
//             label="Day Production"
//             value={Number(production.dayProduction ?? 0).toLocaleString("en-IN")}
//             highlight
//             stopped={stopped}
//           />
//           <MetricRow
//             label="Cycle Time"
//             value={formatDuration(production.cycleTimeSec)}
//             stopped={stopped}
//           />

//           <div
//             className={`mx-3 mt-3 flex min-h-[46px] items-center justify-between gap-2 rounded-lg px-3 py-2 ${
//               stopped ? "bg-rose-200/80" : "bg-violet-50"
//             }`}
//           >
//             <span
//               className={`flex shrink-0 items-center gap-2 text-sm ${
//                 stopped ? "text-rose-800" : "text-violet-700"
//               }`}
//             >
//               <Clock3 className="h-4 w-4" />
//               Last Update
//             </span>
//             <span
//               className={`text-right text-xs font-bold ${
//                 stopped ? "text-rose-800" : "text-violet-800"
//               }`}
//             >
//               {formatLastUpdate(production)}
//             </span>
//           </div>

//           <div className="px-3 pb-3">
//             <ExtraDetails production={production} stopped={stopped} />
//           </div>

//           {isRefreshing && (
//             <p className="px-4 pb-3 text-xs text-slate-400">Refreshing...</p>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

// function AssemblyGroup({ rh, lh, isRefreshing }) {
//   return (
//     <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
//       <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
//         <MachineCard title="RH Assembly" machine={rh} isRefreshing={isRefreshing} />
//         <MachineCard title="LH Assembly" machine={lh} isRefreshing={isRefreshing} />
//       </div>
//     </section>
//   );
// }

// export default function DashboardPage() {
//   const { machines, isRefreshing, refresh } = useProductionViewModel();

//   const aero = machines?.aeroDeflector;
//   const rh = machines?.rh;
//   const lh = machines?.lh;

//   const runningCount = [aero, rh, lh].filter(
//     (machine) => getMachineStatus(machine) === "running"
//   ).length;

//   return (
//     <DashboardLayout>
//       <main className="min-h-screen min-w-0 bg-slate-50 p-4 sm:p-6">
//         <div className="mx-auto w-full max-w-[1800px] min-w-0">
//           <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
//                 <Factory className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900">APIPL</h1>
//                 <p className="text-sm text-slate-500">Assembly Production Dashboard</p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
//                 {runningCount > 0 ? (
//                   <Wifi className="h-4 w-4 text-emerald-600" />
//                 ) : (
//                   <WifiOff className="h-4 w-4 text-rose-600" />
//                 )}
//                 {runningCount}/3 Running
//               </div>

//               <button
//                 type="button"
//                 onClick={refresh}
//                 disabled={isRefreshing}
//                 className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
//               >
//                 <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//                 Refresh
//               </button>
//             </div>
//           </header>

//           <div className="mb-4">
//             <h2 className="text-lg font-bold text-slate-800">Assembly Overview</h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Live production metrics from your production API.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-3">
//             <MachineCard
//               title="Aero Deflector"
//               machine={aero}
//               isRefreshing={isRefreshing}
//             />

//             <div className="min-w-0 2xl:col-span-2">
//               <AssemblyGroup rh={rh} lh={lh} isRefreshing={isRefreshing} />
//             </div>
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
import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
import {
  RefreshCw,
  Factory,
  Clock3,
  Wifi,
  WifiOff,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

// A machine is "running" if its last production event is newer than this.
// Minimum 5 minutes, or 3x the cycle time if that is longer.
const MIN_TIMEOUT_MS = 5 * 60 * 1000;
// Allow small clock differences between server and browser.
const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
// How often the screen re-checks status even if no new data arrives.
const STATUS_TICK_MS = 15 * 1000;

function getMachineTimestamp(production) {
  return production?.productionTime || production?.createdAt || null;
}

function parseApiTimestamp(timestamp) {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getTimeoutMs(production) {
  const cycleMs = Number(production?.cycleTimeSec) * 1000;

  if (Number.isFinite(cycleMs) && cycleMs > 0) {
    return Math.max(MIN_TIMEOUT_MS, cycleMs * 3);
  }

  return MIN_TIMEOUT_MS;
}

function formatLastUpdate(production) {
  const date = parseApiTimestamp(getMachineTimestamp(production));

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
  const date = parseApiTimestamp(getMachineTimestamp(production));

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

  const timestamp = parseApiTimestamp(getMachineTimestamp(production));

  if (!timestamp) return "stopped";

  const age = now - timestamp.getTime();

  // Timestamp meaningfully in the future = real clock problem
  if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

  return age <= getTimeoutMs(production) ? "running" : "stopped";
}

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || seconds === "") {
    return "—";
  }

  const value = Number(seconds);

  if (!Number.isFinite(value) || value < 0) return "—";

  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${remainingSeconds} sec`;
  }

  if (minutes > 0) {
    return `${minutes} min ${remainingSeconds} sec`;
  }

  return `${remainingSeconds} sec`;
}

function MachineStatus({ status }) {
  const running = status === "running";
  const loading = status === "loading";
  const timeError = status === "time-error";
  const apiError = status === "error";

  let label = "MACHINE STOPPED";
  let colors = "bg-rose-100 text-rose-700";
  let dot = "bg-rose-500";

  if (running) {
    label = "RUNNING";
    colors = "bg-emerald-50 text-emerald-700";
    dot = "bg-emerald-500";
  } else if (loading) {
    label = "LOADING";
    colors = "bg-slate-100 text-slate-600";
    dot = "bg-slate-400";
  } else if (apiError) {
    label = "API ERROR";
    colors = "bg-amber-100 text-amber-800";
    dot = "bg-amber-500";
  } else if (timeError) {
    label = "CHECK TIME";
    colors = "bg-amber-100 text-amber-800";
    dot = "bg-amber-500";
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${colors}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function MachineIdentity({ title, production }) {
  return (
    <div className="border-b border-slate-100 px-4 py-3">
      <p className="text-base font-bold text-slate-900">
        {production?.partName || title}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        Subname: {production?.subname || production?.machineId || "—"}
      </p>
      <p className="mt-0.5 text-sm text-slate-500">
        Station: {production?.station || "—"}
      </p>
    </div>
  );
}

function MetricRow({ label, value, stopped, highlight = false }) {
  return (
    <div
      className={`flex min-h-[48px] items-center justify-between gap-3 border-b px-4 py-3 ${
        stopped ? "border-rose-200" : "border-slate-100"
      }`}
    >
      <span
        className={`text-sm ${
          stopped ? "text-rose-700" : "text-slate-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-right font-semibold ${
          highlight
            ? `text-lg ${stopped ? "text-rose-700" : "text-violet-600"}`
            : `text-sm ${stopped ? "text-rose-800" : "text-slate-800"}`
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function ExtraDetails({ production, stopped }) {
  const items = [
    ["Device Name", production?.deviceId],
    ["Machine ID", production?.machineId],
    ["Tenant ID", production?.tenantId],
    ["Customer ID", production?.customerId],
    ["Event ID", production?.eventId],
    ["Production Time (UTC)", production?.productionTime],
    ["Created At (UTC)", production?.createdAt],
  ];

  return (
    <details className="group mt-3">
      <summary
        className={`flex cursor-pointer list-none items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium ${
          stopped
            ? "border-rose-200 text-rose-700 hover:bg-rose-100"
            : "border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span>More details</span>
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-lg border border-slate-200 bg-white p-3"
          >
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 break-words text-sm font-medium text-slate-800">
              {value === null || value === undefined || value === ""
                ? "—"
                : String(value)}
            </p>
          </div>
        ))}
      </div>
    </details>
  );
}

function MachineCard({ title, machine, isRefreshing, now }) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = getMachineStatus(machine, now);
  const stopped = status === "stopped" || status === "error";
  const ago = production ? formatAgo(production, now) : null;

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm ${
        stopped
          ? "border-rose-300 bg-rose-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <header
        className={`flex min-h-[54px] items-center justify-between gap-2 px-4 py-3 ${
          stopped ? "bg-rose-700" : "bg-indigo-600"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <Factory className="h-4 w-4 text-white" />
          </div>
          <h2 className="truncate text-base font-bold text-white">{title}</h2>
        </div>
        <MachineStatus status={status} />
      </header>

      {!production ? (
        <div className="p-4">
          {status === "loading" ? (
            <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
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
        <>
          {status === "time-error" && (
            <div className="m-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              The API timestamp is in the future. Check the backend clock.
            </div>
          )}

          {status === "stopped" && (
            <div className="m-3 rounded-lg border border-rose-200 bg-rose-100 p-3 text-sm text-rose-800">
              No recent production timestamp received within the configured timeout.
            </div>
          )}

          <MachineIdentity title={title} production={production} />

          <MetricRow label="Shift" value={production.shiftName} stopped={stopped} />
          <MetricRow
            label="Shift Production"
            value={Number(production.productionCount ?? 0).toLocaleString("en-IN")}
            highlight
            stopped={stopped}
          />
          <MetricRow
            label="Day Production"
            value={Number(production.dayProduction ?? 0).toLocaleString("en-IN")}
            highlight
            stopped={stopped}
          />
          <MetricRow
            label="Cycle Time"
            value={formatDuration(production.cycleTimeSec)}
            stopped={stopped}
          />

          <div
            className={`mx-3 mt-3 flex min-h-[46px] items-center justify-between gap-2 rounded-lg px-3 py-2 ${
              stopped ? "bg-rose-200/80" : "bg-violet-50"
            }`}
          >
            <span
              className={`flex shrink-0 items-center gap-2 text-sm ${
                stopped ? "text-rose-800" : "text-violet-700"
              }`}
            >
              <Clock3 className="h-4 w-4" />
              Last Update
            </span>
            <span
              className={`text-right text-xs font-bold ${
                stopped ? "text-rose-800" : "text-violet-800"
              }`}
            >
              {formatLastUpdate(production)}
              {ago && (
                <span className="block font-medium opacity-80">{ago}</span>
              )}
            </span>
          </div>

          <div className="px-3 pb-3">
            <ExtraDetails production={production} stopped={stopped} />
          </div>

          {isRefreshing && (
            <p className="px-4 pb-3 text-xs text-slate-400">Refreshing...</p>
          )}
        </>
      )}
    </section>
  );
}

function AssemblyGroup({ rh, lh, isRefreshing, now }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-2">
        <MachineCard
          title="RH Assembly"
          machine={rh}
          isRefreshing={isRefreshing}
          now={now}
        />
        <MachineCard
          title="LH Assembly"
          machine={lh}
          isRefreshing={isRefreshing}
          now={now}
        />
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { machines, isRefreshing, refresh } = useProductionViewModel();

  // Re-evaluate running/stopped regularly, even when no new data arrives
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const aero = machines?.aeroDeflector;
  const rh = machines?.rh;
  const lh = machines?.lh;

  const runningCount = [aero, rh, lh].filter(
    (machine) => getMachineStatus(machine, now) === "running"
  ).length;

  return (
    <DashboardLayout>
      <main className="min-h-screen min-w-0 bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">APIPL</h1>
                <p className="text-sm text-slate-500">Assembly Production Dashboard</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                {runningCount > 0 ? (
                  <Wifi className="h-4 w-4 text-emerald-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-rose-600" />
                )}
                {runningCount}/3 Running
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </header>

          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">Assembly Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Live production metrics from your production API.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-3">
            <MachineCard
              title="Aero Deflector"
              machine={aero}
              isRefreshing={isRefreshing}
              now={now}
            />

            <div className="min-w-0 2xl:col-span-2">
              <AssemblyGroup rh={rh} lh={lh} isRefreshing={isRefreshing} now={now} />
            </div>
          </div>

          <footer className="mt-6 border-t border-slate-200 py-4 text-center text-xs text-slate-400">
            ABHIJEET Smart Monitoring System
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}