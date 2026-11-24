// "use client";

// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import ThemeToggle from "@/components/common/theme-toggle";
// import { LiveAgo } from "@/components/common/live-ago";
// import {
//   IMM_MACHINES,
//   useImmViewModel,
// } from "@/features/moulding/view-models/use-imm-view-model";
// import {
//   Activity,
//   AlertCircle,
//   Clock3,
//   Factory,
//   Hash,
//   Layers,
//   RefreshCw,
//   Timer,
//   Wifi,
//   WifiOff,
// } from "lucide-react";

// /* ============================================================
//    SETTINGS
//    ============================================================ */

// const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
// const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
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

// function formatCycleTime(seconds) {
//   if (seconds === null || seconds === undefined || seconds === "") return "—";
//   const value = Number(seconds);
//   if (!Number.isFinite(value) || value < 0) return "—";
//   return `${value.toFixed(2)} sec`;
// }

// function textOrDash(value) {
//   const text = value == null ? "" : String(value).trim();
//   return text === "" ? "—" : text;
// }

// function formatShotProductionTime(value) {
//   if (!value) return "—";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "—";
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

// /* ============================================================
//    STATUS BADGE
//    Same system as Assembly page:
//    Running  → soft green pill on purple header
//    Stopped  → solid red pill on purple header
//    Others   → muted tint
//    ============================================================ */
// function StatusBadge({ status }) {
//   if (status === "running") {
//     return (
//       <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 sm:text-[11px]">
//         <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//         RUNNING
//       </span>
//     );
//   }

//   if (status === "loading") {
//     return (
//       <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70 sm:text-[11px]">
//         <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
//         LOADING
//       </span>
//     );
//   }

//   if (status === "error" || status === "time-error") {
//     return (
//       <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-200 sm:text-[11px]">
//         <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
//         {status === "time-error" ? "CHECK TIME" : "API ERROR"}
//       </span>
//     );
//   }

//   // stopped — solid red pill on the purple header
//   return (
//     <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white sm:text-[11px]">
//       <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
//       MACHINE STOPPED
//     </span>
//   );
// }

// /* ============================================================
//    STOPPED ALERT STRIP
//    Slim single-line strip just below the header.
//    Card body stays white — no red backgrounds on the whole card.
//    ============================================================ */
// function StoppedAlert({ production }) {
//   return (
//     <div
//       role="alert"
//       className="flex items-center gap-2.5 border-b border-rose-100 bg-rose-50 px-4 py-2 dark:border-rose-500/15 dark:bg-rose-500/8"
//     >
//       <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500 dark:text-rose-400" />
//       <div className="min-w-0 flex-1">
//         <span className="text-[11px] font-bold uppercase tracking-wide text-rose-600 dark:text-rose-400">
//           Machine stopped
//         </span>
//         <span className="ml-2 text-[11px] text-rose-500/80 dark:text-rose-400/70">
//           Last update{" "}
//           <span className="font-semibold">{formatLastUpdate(production)}</span>
//           {" · "}
//           <LiveAgo production={production} className="font-semibold" />
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    SUMMARY TILES  (top of page — machines running / totals)
//    ============================================================ */
// function SummaryTile({ icon: Icon, label, value, sub, tone = "indigo" }) {
//   const tones = {
//     indigo:
//       "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
//     emerald:
//       "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
//     violet:
//       "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
//   };

//   return (
//     <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//       <div
//         className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
//       >
//         <Icon className="h-6 w-6" />
//       </div>
//       <div className="min-w-0">
//         <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           {label}
//         </p>
//         <p className="mt-0.5 truncate text-2xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
//           {value}
//         </p>
//         <p className="truncate text-xs text-slate-500 dark:text-slate-400">
//           {sub || " "}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    STAT TILE  (Shift Production / Day Production / Cycle Time / Mould)
//    White background always. Stopped state uses rose text only —
//    no red card backgrounds.
//    ============================================================ */
// function StatTile({ icon: Icon, label, value, sub, stopped, small = false }) {
//   return (
//     <div className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
//       <div className="flex items-center gap-2">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
//           <Icon className="h-4 w-4" />
//         </div>
//         <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
//           {label}
//         </p>
//       </div>

//       <p
//         className={`mt-4 break-words font-extrabold leading-none tabular-nums text-blue-700 dark:text-blue-400 ${
//           small ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
//         }`}
//       >
//         {value}
//       </p>

//       <p className="mt-2 min-h-[1rem] truncate text-xs text-slate-500 dark:text-slate-400">
//         {sub || " "}
//       </p>
//     </div>
//   );
// }

// /* ============================================================
//    LAST UPDATE ROW
//    Violet pill when running, rose pill when stopped.
//    ============================================================ */
// function LastUpdateRow({ production, status }) {
//   const stopped = status === "stopped" || status === "error";
//   return (
//     <div className="flex min-h-[52px] flex-col gap-1 rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-500/10 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
//       <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-800 dark:text-blue-400">
//         <Clock3 className="h-4 w-4" />
//         Last Update
//         {status === "running" && (
//           <span className="relative ml-1 flex h-2.5 w-2.5">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
//             <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
//           </span>
//         )}
//       </span>

//       <span className="min-w-0 break-words text-left text-sm font-bold text-blue-900 dark:text-blue-200 sm:text-right">
//         {formatLastUpdate(production)}
//         <LiveAgo
//           production={production}
//           wrap
//           className={`ml-2 text-xs font-medium ${
//             stopped ? "text-rose-500 dark:text-rose-400" : "opacity-80"
//           }`}
//         />
//       </span>
//     </div>
//   );
// }

// /* ============================================================
//    LAST 10 SHOTS + CYCLE TIME SUMMARY
//    ============================================================ */
// function CycleTimeLogStats({ stats, loading, error }) {
//   const shots = Array.isArray(stats?.shots) ? stats.shots.slice(0, 10) : [];

//   const summary = [
//     { label: "Minimum Cycle Time", value: stats?.minCycleTimeSec },
//     { label: "Maximum Cycle Time", value: stats?.maxCycleTimeSec },
//     { label: "Average Cycle Time", value: stats?.avgCycleTimeSec },
//   ];

//   return (
//     <div className="border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
//       <div className="mb-4">
//         <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 sm:text-base">
//           Last 10 Shots — Cycle Time Analysis
//         </h3>
//       </div>

//       {loading && !stats ? (
//         <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//           <RefreshCw className="h-4 w-4 animate-spin" />
//           Loading last 10 shots...
//         </div>
//       ) : error && !stats ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//           Unable to load shot data: {String(error?.message || error)}
//         </div>
//       ) : (
//         <>
//           {error && (
//             <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               Showing the last received shot data.{" "}
//               {String(error?.message || error)}
//             </div>
//           )}

//           {/* Shots table */}
//           <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
//             <table className="w-full min-w-[600px] border-collapse text-left text-sm">
//               <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:text-xs">
//                 <tr>
//                   <th className="px-4 py-3">Shot</th>
//                   <th className="px-4 py-3">Cycle Time</th>
//                   <th className="px-4 py-3">Production Time</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                 {shots.map((shot, index) => {
//                   const cycleTime = Number(shot.cycle_time_sec);
//                   const hasCycleTime =
//                     shot.cycle_time_sec !== null &&
//                     shot.cycle_time_sec !== undefined &&
//                     shot.cycle_time_sec !== "" &&
//                     Number.isFinite(cycleTime);

//                   return (
//                     <tr
//                       key={shot.id ?? shot.event_id ?? index}
//                       className="transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
//                     >
//                       <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
//                         {shots.length - index}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-blue-800 dark:text-blue-400">
//                         {hasCycleTime ? `${cycleTime.toFixed(3)} sec` : "—"}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
//                         {formatShotProductionTime(shot.production_time)}
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {shots.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500"
//                     >
//                       {loading
//                         ? "Loading shot records..."
//                         : "No shot records available."}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Cycle time summary */}
//           <div className="mt-4">
//             <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-[11px]">
//               Cycle Time Summary
//             </h4>
//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//               {summary.map((item) => {
//                 const valid =
//                   item.value !== null &&
//                   item.value !== undefined &&
//                   item.value !== "" &&
//                   Number.isFinite(Number(item.value));

//                 return (
//                   <div
//                     key={item.label}
//                     className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
//                   >
//                     <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs">
//                       {item.label}
//                     </p>
//                     <p className="mt-2 text-xl font-extrabold tabular-nums text-blue-800 dark:text-blue-400 sm:text-2xl">
//                       {valid ? Number(item.value).toFixed(3) : "—"}
//                       {valid && (
//                         <span className="ml-1 text-sm font-semibold text-blue-600 dark:text-blue-600">
//                           sec
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    MACHINE CARD
//    Purple header always — running and stopped cards look the same
//    structurally. Status communicated via badge + slim alert strip.
//    Card body is always white.
//    ============================================================ */
// function ImmMachineCard({ config, machine, isRefreshing, now }) {
//   const production = machine?.data ?? null;
//   const error = machine?.error ?? null;
//   const status = getMachineStatus(machine, now);
//   const stopped = status === "stopped" || status === "error";

//   return (
//     <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
//       {/* ── Purple header ── always the same colour ── */}
//       <header className="flex min-h-[60px] flex-col gap-2 bg-blue-700 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
//             <Factory className="h-4.5 w-4.5 h-[18px] w-[18px] text-white" />
//           </div>
//           <div className="min-w-0">
//             <h2 className="truncate text-sm font-semibold leading-tight text-white sm:text-base">
//               {config.title}
//             </h2>
//             <p className="truncate text-xs text-white/60">
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
//           {production?.shiftName && (
//             <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
//               SHIFT {production.shiftName}
//             </span>
//           )}
//           <StatusBadge status={status} />
//         </div>
//       </header>

//       {/* ── Compact stopped alert strip ── */}
//       {production && stopped && <StoppedAlert production={production} />}

//       {/* ── Card body ── */}
//       {!production ? (
//         <div className="p-5">
//           {status === "loading" ? (
//             <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
//               <RefreshCw className="h-4 w-4 animate-spin" />
//               Loading...
//             </div>
//           ) : (
//             <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <div className="min-w-0">
//                 <p className="font-semibold">Unable to load machine data</p>
//                 <p className="mt-1 break-words text-xs">
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
//             <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               The API timestamp is in the future. Check the backend clock.
//             </div>
//           )}

//           {/* Stale-data notice (error but data still available) */}
//           {error && (
//             <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//               <p className="min-w-0 break-words text-xs">
//                 Showing the last received data. {String(error)}
//               </p>
//             </div>
//           )}

//           {/* Key metrics grid */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//             <StatTile
//               icon={Layers}
//               label="Shift Production"
//               value={formatNumber(production.productionCount)}
//               sub={
//                 production.shiftName ? `Shift ${production.shiftName}` : ""
//               }
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
//             <StatTile
//               icon={Hash}
//               label="Mould No."
//               value={textOrDash(production.moldNo)}
//               sub="Mould in use"
//               stopped={stopped}
//               small
//             />
//           </div>

//           {/* Last update row */}
//           <LastUpdateRow production={production} status={status} />

//           {isRefreshing && (
//             <p className="text-[11px] text-slate-400">Refreshing…</p>
//           )}
//         </div>
//       )}

//       {/* Last 10 shots + cycle time analysis */}
//       <CycleTimeLogStats
//         stats={machine?.logStats}
//         loading={machine?.logLoading}
//         error={machine?.logError}
//       />
//     </section>
//   );
// }

// /* ============================================================
//    PAGE
//    ============================================================ */
// export default function MouldingOverviewView() {
//   const { machines, isRefreshing, refresh } = useImmViewModel();

//   const [now, setNow] = useState(() => Date.now());
//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
//     return () => clearInterval(id);
//   }, []);

//   const runningCount = IMM_MACHINES.filter(
//     (config) => getMachineStatus(machines?.[config.key], now) === "running"
//   ).length;

//   const totals = IMM_MACHINES.reduce(
//     (sum, config) => {
//       const data = machines?.[config.key]?.data;
//       return {
//         shift: sum.shift + Number(data?.productionCount ?? 0),
//         day: sum.day + Number(data?.dayProduction ?? 0),
//       };
//     },
//     { shift: 0, day: 0 }
//   );

//   return (
//     <DashboardLayout>
//       <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 p-3 dark:bg-slate-950 sm:p-6">
//         <div className="mx-auto w-full max-w-[1800px] min-w-0">

//           {/* ── Top header bar ── */}
//           <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 sm:h-11 sm:w-11">
//                 <Factory className="h-5 w-5 text-white" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
//                   APIPL
//                 </h1>
//                 <p className="text-xs text-slate-400 dark:text-slate-500">
//                   Injection Moulding Overview
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
//               <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
//                 {runningCount > 0 ? (
//                   <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
//                 ) : (
//                   <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-500" />
//                 )}
//                 <span className="whitespace-nowrap">
//                   {runningCount}/{IMM_MACHINES.length} Running
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={refresh}
//                 disabled={isRefreshing}
//                 className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
//               >
//                 <RefreshCw
//                   className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>

//               <ThemeToggle />
//             </div>
//           </header>

//           {/* ── Summary tiles ── */}
//           <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
//             <SummaryTile
//               icon={Activity}
//               label="Machines Running"
//               value={`${runningCount} / ${IMM_MACHINES.length}`}
//               tone="emerald"
//             />
//             <SummaryTile
//               icon={Layers}
//               label="Shift Production"
//               value={formatNumber(totals.shift)}
//               sub="All machines"
//               tone="indigo"
//             />
//             <SummaryTile
//               icon={Factory}
//               label="Day Production"
//               value={formatNumber(totals.day)}
//               sub="All machines"
//               tone="violet"
//             />
//           </div>

//           {/* ── Section heading ── */}
//           <div className="mb-3 px-0.5">
//             <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 sm:text-[13px]">
//               Injection Moulding Machines
//             </h2>
//           </div>

//           {/* ── Machine cards ── */}
//           <div className="grid grid-cols-1 items-start gap-4 sm:gap-5">
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

//           <footer className="mt-6 border-t border-slate-100 py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
//             ABHIJEET Smart Monitoring System
//           </footer>
//         </div>
//       </main>
//     </DashboardLayout>
//   );
// }























// "use client";

// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import ThemeToggle from "@/components/common/theme-toggle";
// import { LiveAgo } from "@/components/common/live-ago";
// import {
//   IMM_MACHINES,
//   useImmViewModel,
// } from "@/features/moulding/view-models/use-imm-view-model";
// import {
//   Activity,
//   AlertCircle,
//   Clock3,
//   Factory,
//   Hash,
//   Layers,
//   RefreshCw,
//   Timer,
//   Wifi,
//   WifiOff,
// } from "lucide-react";

// /* ============================================================
//    SETTINGS
//    ============================================================ */

// const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
// const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
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

//   return Number.isFinite(number)
//     ? number.toLocaleString("en-IN")
//     : "—";
// }

// function formatCycleTime(seconds) {
//   if (seconds === null || seconds === undefined || seconds === "") {
//     return "—";
//   }

//   const value = Number(seconds);

//   if (!Number.isFinite(value) || value < 0) return "—";

//   return `${value.toFixed(2)} sec`;
// }

// function textOrDash(value) {
//   const text = value == null ? "" : String(value).trim();

//   return text === "" ? "—" : text;
// }

// function formatShotProductionTime(value) {
//   if (!value) return "—";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "—";

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

// /* ============================================================
//    STATUS BADGE
//    ============================================================ */

// function StatusBadge({ status }) {
//   if (status === "running") {
//     return (
//       <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 sm:text-[11px]">
//         <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//         RUNNING
//       </span>
//     );
//   }

//   if (status === "loading") {
//     return (
//       <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70 sm:text-[11px]">
//         <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
//         LOADING
//       </span>
//     );
//   }

//   if (status === "error" || status === "time-error") {
//     return (
//       <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-200 sm:text-[11px]">
//         <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
//         {status === "time-error" ? "CHECK TIME" : "API ERROR"}
//       </span>
//     );
//   }

//   return (
//     <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white sm:text-[11px]">
//       <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
//       MACHINE STOPPED
//     </span>
//   );
// }

// /* ============================================================
//    STOPPED ALERT STRIP
//    ============================================================ */

// function StoppedAlert({ production }) {
//   return (
//     <div
//       role="alert"
//       className="flex items-center gap-2.5 border-b border-rose-100 bg-rose-50 px-4 py-2 dark:border-rose-400/30 dark:bg-rose-900/50"
//     >
//       <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500 dark:text-rose-400" />

//       <div className="min-w-0 flex-1">
//         <span className="text-[11px] font-bold uppercase tracking-wide text-rose-600 dark:text-rose-400">
//           Machine stopped
//         </span>

//         <span className="ml-2 text-[11px] text-rose-500/80 dark:text-rose-300">
//           Last update{" "}
//           <span className="font-semibold">
//             {formatLastUpdate(production)}
//           </span>
//           {" · "}
//           <LiveAgo production={production} className="font-semibold" />
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    SUMMARY TILES
//    ============================================================ */

// function SummaryTile({
//   icon: Icon,
//   label,
//   value,
//   sub,
//   tone = "indigo",
// }) {
//   const tones = {
//     indigo:
//       "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",

//     emerald:
//       "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

//     violet:
//       "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
//   };

//   return (
//     <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//       <div
//         className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
//       >
//         <Icon className="h-6 w-6" />
//       </div>

//       <div className="min-w-0">
//         <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white/70">
//           {label}
//         </p>

//         <p className="mt-0.5 truncate text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
//           {value}
//         </p>

//         <p className="truncate text-xs text-slate-500 dark:text-white/60">
//           {sub || " "}
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    STAT TILE
//    Stopped = red in light mode, white text in dark mode.
//    Running = blue in light mode, white text in dark mode.
//    ============================================================ */

// function StatTile({
//   icon: Icon,
//   label,
//   value,
//   sub,
//   stopped,
//   small = false,
// }) {
//   return (
//     <div
//       className={`flex min-w-0 flex-col justify-between rounded-xl border p-4 transition-none ${
//         stopped
//           ? "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950"
//           : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
//       }`}
//     >
//       <div className="flex items-center gap-2">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
//           <Icon className="h-4 w-4" />
//         </div>

//         <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-white/80">
//           {label}
//         </p>
//       </div>

//       <p
//         className={`mt-4 break-words font-extrabold leading-none tabular-nums ${
//           stopped
//             ? "text-rose-600 dark:text-white"
//             : "text-blue-700 dark:text-white"
//         } ${
//           small ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
//         }`}
//       >
//         {value}
//       </p>

//       <p className="mt-2 min-h-[1rem] truncate text-xs text-slate-600 dark:text-white/70">
//         {sub || " "}
//       </p>
//     </div>
//   );
// }

// /* ============================================================
//    LAST UPDATE ROW
//    ============================================================ */

// function LastUpdateRow({ production, status }) {
//   const stopped = status === "stopped" || status === "error";

//   return (
//     <div
//       className={`flex min-h-[52px] flex-col gap-1 rounded-xl px-4 py-3 transition-none sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${
//         stopped
//           ? "bg-rose-100 dark:bg-rose-900/70"
//           : "bg-blue-50 dark:bg-blue-500/10"
//       }`}
//     >
//       <span
//         className={`flex shrink-0 items-center gap-2 text-sm font-semibold ${
//           stopped
//             ? "text-rose-800 dark:text-rose-100"
//             : "text-blue-800 dark:text-white"
//         }`}
//       >
//         <Clock3 className="h-4 w-4" />
//         Last Update

//         {status === "running" && (
//           <span className="relative ml-1 flex h-2.5 w-2.5">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
//             <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
//           </span>
//         )}
//       </span>

//       <span
//         className={`min-w-0 break-words text-left text-sm font-bold sm:text-right ${
//           stopped
//             ? "text-rose-950 dark:text-white"
//             : "text-blue-900 dark:text-white"
//         }`}
//       >
//         {formatLastUpdate(production)}

//         <LiveAgo
//           production={production}
//           wrap
//           className={`ml-2 text-xs font-medium ${
//             stopped
//               ? "text-rose-600 dark:text-rose-300"
//               : "text-blue-700 dark:text-blue-300"
//           }`}
//         />
//       </span>
//     </div>
//   );
// }

// /* ============================================================
//    LAST 10 SHOTS + CYCLE TIME SUMMARY
//    ============================================================ */

// function CycleTimeLogStats({ stats, loading, error }) {
//   const shots = Array.isArray(stats?.shots)
//     ? stats.shots.slice(0, 10)
//     : [];

//   const summary = [
//     { label: "Minimum Cycle Time", value: stats?.minCycleTimeSec },
//     { label: "Maximum Cycle Time", value: stats?.maxCycleTimeSec },
//     { label: "Average Cycle Time", value: stats?.avgCycleTimeSec },
//   ];

//   return (
//     <div className="border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
//       <div className="mb-4">
//         <h3 className="text-sm font-bold text-slate-800 dark:text-white sm:text-base">
//           Last 10 Shots — Cycle Time Analysis
//         </h3>
//       </div>

//       {loading && !stats ? (
//         <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-500 dark:text-white/70">
//           <RefreshCw className="h-4 w-4 animate-spin" />
//           Loading last 10 shots...
//         </div>
//       ) : error && !stats ? (
//         <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//           Unable to load shot data: {String(error?.message || error)}
//         </div>
//       ) : (
//         <>
//           {error && (
//             <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               Showing the last received shot data.{" "}
//               {String(error?.message || error)}
//             </div>
//           )}

//           <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
//             <table className="w-full min-w-[600px] border-collapse text-left text-sm">
//               <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-white/70 sm:text-xs">
//                 <tr>
//                   <th className="px-4 py-3">Shot</th>
//                   <th className="px-4 py-3">Cycle Time</th>
//                   <th className="px-4 py-3">Production Time</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                 {shots.map((shot, index) => {
//                   const cycleTime = Number(shot.cycle_time_sec);

//                   const hasCycleTime =
//                     shot.cycle_time_sec !== null &&
//                     shot.cycle_time_sec !== undefined &&
//                     shot.cycle_time_sec !== "" &&
//                     Number.isFinite(cycleTime);

//                   return (
//                     <tr
//                       key={shot.id ?? shot.event_id ?? index}
//                       className="transition-none hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
//                     >
//                       <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-white">
//                         {shots.length - index}
//                       </td>

//                       <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-blue-800 dark:text-white">
//                         {hasCycleTime
//                           ? `${cycleTime.toFixed(3)} sec`
//                           : "—"}
//                       </td>

//                       <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-white/80">
//                         {formatShotProductionTime(shot.production_time)}
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {shots.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={3}
//                       className="px-4 py-8 text-center text-sm text-slate-500 dark:text-white/60"
//                     >
//                       {loading
//                         ? "Loading shot records..."
//                         : "No shot records available."}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4">
//             <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-white/70 sm:text-[11px]">
//               Cycle Time Summary
//             </h4>

//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//               {summary.map((item) => {
//                 const valid =
//                   item.value !== null &&
//                   item.value !== undefined &&
//                   item.value !== "" &&
//                   Number.isFinite(Number(item.value));

//                 return (
//                   <div
//                     key={item.label}
//                     className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
//                   >
//                     <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-white/70 sm:text-xs">
//                       {item.label}
//                     </p>

//                     <p className="mt-2 text-xl font-extrabold tabular-nums text-blue-800 dark:text-white sm:text-2xl">
//                       {valid ? Number(item.value).toFixed(3) : "—"}

//                       {valid && (
//                         <span className="ml-1 text-sm font-semibold text-blue-600 dark:text-white/80">
//                           sec
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    MACHINE CARD
//    ============================================================ */

// function ImmMachineCard({ config, machine, isRefreshing, now }) {
//   const production = machine?.data ?? null;
//   const error = machine?.error ?? null;

//   const status = getMachineStatus(machine, now);
//   const stopped = status === "stopped" || status === "error";

//   return (
//     <section
//       className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm transition-none ${
//         stopped
//           ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
//           : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
//       }`}
//     >
//       <header
//         className={`flex min-h-[60px] flex-col gap-2 px-4 py-3 transition-none sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
//           stopped ? "bg-rose-700 dark:bg-rose-800" : "bg-blue-700"
//         }`}
//       >
//         <div className="flex min-w-0 items-center gap-3">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
//             <Factory className="h-[18px] w-[18px] text-white" />
//           </div>

//           <div className="min-w-0">
//             <h2 className="truncate text-sm font-semibold leading-tight text-white sm:text-base">
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

//           {production?.shiftName && (
//             <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
//               SHIFT {production.shiftName}
//             </span>
//           )}

//           <StatusBadge status={status} />
//         </div>
//       </header>

//       {production && stopped && (
//         <StoppedAlert production={production} />
//       )}

//       {!production ? (
//         <div className="p-5">
//           {status === "loading" ? (
//             <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-500 dark:text-white/70">
//               <RefreshCw className="h-4 w-4 animate-spin" />
//               Loading...
//             </div>
//           ) : (
//             <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

//               <div className="min-w-0">
//                 <p className="font-semibold">
//                   Unable to load machine data
//                 </p>

//                 <p className="mt-1 break-words text-xs">
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
//             <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               The API timestamp is in the future. Check the backend clock.
//             </div>
//           )}

//           {error && (
//             <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
//               <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

//               <p className="min-w-0 break-words text-xs">
//                 Showing the last received data. {String(error)}
//               </p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//             <StatTile
//               icon={Layers}
//               label="Shift Production"
//               value={formatNumber(production.productionCount)}
//               sub={
//                 production.shiftName
//                   ? `Shift ${production.shiftName}`
//                   : ""
//               }
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

//             <StatTile
//               icon={Hash}
//               label="Mould No."
//               value={textOrDash(production.moldNo)}
//               sub="Mould in use"
//               stopped={stopped}
//               small
//             />
//           </div>

//           <LastUpdateRow
//             production={production}
//             status={status}
//           />

//           {isRefreshing && (
//             <p className="text-[11px] text-slate-500 dark:text-white/60">
//               Refreshing…
//             </p>
//           )}
//         </div>
//       )}

//       <CycleTimeLogStats
//         stats={machine?.logStats}
//         loading={machine?.logLoading}
//         error={machine?.logError}
//       />
//     </section>
//   );
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function MouldingOverviewView() {
//   const { machines, isRefreshing, refresh } = useImmViewModel();

//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);

//     return () => clearInterval(id);
//   }, []);

//   const runningCount = IMM_MACHINES.filter(
//     (config) =>
//       getMachineStatus(machines?.[config.key], now) === "running"
//   ).length;

//   const totals = IMM_MACHINES.reduce(
//     (sum, config) => {
//       const data = machines?.[config.key]?.data;

//       return {
//         shift: sum.shift + Number(data?.productionCount ?? 0),
//         day: sum.day + Number(data?.dayProduction ?? 0),
//       };
//     },
//     { shift: 0, day: 0 }
//   );

//   return (
//     <DashboardLayout>
//       <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 p-3 dark:bg-slate-950 sm:p-6">
//         <div className="mx-auto w-full max-w-[1800px] min-w-0">
//           <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 sm:h-11 sm:w-11">
//                 <Factory className="h-5 w-5 text-white" />
//               </div>

//               <div className="min-w-0">
//                 <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
//                   APIPL
//                 </h1>

//                 <p className="text-xs text-slate-500 dark:text-white/60">
//                   Injection Moulding Overview
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
//               <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-white">
//                 {runningCount > 0 ? (
//                   <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
//                 ) : (
//                   <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-500" />
//                 )}

//                 <span className="whitespace-nowrap">
//                   {runningCount}/{IMM_MACHINES.length} Running
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={refresh}
//                 disabled={isRefreshing}
//                 className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
//               >
//                 <RefreshCw
//                   className={`h-3.5 w-3.5 ${
//                     isRefreshing ? "animate-spin" : ""
//                   }`}
//                 />
//                 Refresh
//               </button>

//               <ThemeToggle />
//             </div>
//           </header>

//           <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
//             <SummaryTile
//               icon={Activity}
//               label="Machines Running"
//               value={`${runningCount} / ${IMM_MACHINES.length}`}
//               tone="emerald"
//             />

//             <SummaryTile
//               icon={Layers}
//               label="Shift Production"
//               value={formatNumber(totals.shift)}
//               sub="All machines"
//               tone="indigo"
//             />

//             <SummaryTile
//               icon={Factory}
//               label="Day Production"
//               value={formatNumber(totals.day)}
//               sub="All machines"
//               tone="violet"
//             />
//           </div>

//           <div className="mb-3 px-0.5">
//             <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-white/70 sm:text-[13px]">
//               Injection Moulding Machines
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 items-start gap-4 sm:gap-5">
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

//           <footer className="mt-6 border-t border-slate-100 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-white/60">
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
import ThemeToggle from "@/components/common/theme-toggle";
import { LiveAgo } from "@/components/common/live-ago";
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

const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
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

function formatCycleTime(seconds) {
  if (seconds === null || seconds === undefined || seconds === "") return "—";

  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "—";

  return `${value.toFixed(2)} sec`;
}

function textOrDash(value) {
  const text = value == null ? "" : String(value).trim();
  return text === "" ? "—" : text;
}

function formatShotProductionTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

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

/* ============================================================
   STATUS BADGE
   ============================================================ */

function StatusBadge({ status }) {
  if (status === "running") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        RUNNING
      </span>
    );
  }

  if (status === "loading") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        LOADING
      </span>
    );
  }

  if (status === "error" || status === "time-error") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold text-amber-200 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        {status === "time-error" ? "CHECK TIME" : "API ERROR"}
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold text-white sm:text-[11px]">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-200" />
      MACHINE STOPPED
    </span>
  );
}

/* ============================================================
   STOPPED ALERT STRIP
   ============================================================ */

function StoppedAlert({ production }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 border-b border-rose-100 bg-rose-50 px-4 py-2 dark:border-rose-500/15 dark:bg-rose-500/8"
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500 dark:text-rose-400" />

      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wide text-rose-600 dark:text-rose-400">
          Machine stopped
        </span>

        <span className="ml-2 text-[11px] text-rose-500/80 dark:text-rose-400/70">
          Last update{" "}
          <span className="font-semibold">
            {formatLastUpdate(production)}
          </span>
          {" · "}
          <LiveAgo production={production} className="font-semibold" />
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   SUMMARY TILES
   ============================================================ */

function SummaryTile({ icon: Icon, label, value, sub, tone = "indigo" }) {
  const tones = {
    indigo:
      "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
    emerald:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    violet:
      "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  };

  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-2xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
          {value}
        </p>

        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {sub || " "}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   STAT TILE
   Stopped: red in light mode, white in dark mode.
   Running: blue in light mode, white in dark mode.
   ============================================================ */

function StatTile({ icon: Icon, label, value, sub, stopped, small = false }) {
  return (
    <div
      className={`flex min-w-0 flex-col justify-between rounded-xl border p-4 transition-none ${
        stopped
          ? "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <Icon className="h-4 w-4" />
        </div>

        <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-white/80">
          {label}
        </p>
      </div>

      <p
        className={`mt-4 break-words font-extrabold leading-none tabular-nums ${
          stopped ? "text-rose-600 dark:text-white" : "text-blue-700 dark:text-white"
        } ${small ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
      >
        {value}
      </p>

      <p className="mt-2 min-h-[1rem] truncate text-xs text-slate-600 dark:text-white/70">
        {sub || " "}
      </p>
    </div>
  );
}

/* ============================================================
   LAST UPDATE ROW
   ============================================================ */

function LastUpdateRow({ production, status }) {
  const stopped = status === "stopped" || status === "error";

  return (
    <div
      className={`flex min-h-[52px] flex-col gap-1 rounded-xl px-4 py-3 transition-none sm:flex-row sm:items-center sm:justify-between sm:gap-3 ${
        stopped
          ? "bg-rose-100 dark:bg-rose-900/70"
          : "bg-blue-50 dark:bg-blue-500/10"
      }`}
    >
      <span
        className={`flex shrink-0 items-center gap-2 text-sm font-semibold ${
          stopped
            ? "text-rose-800 dark:text-rose-100"
            : "text-blue-800 dark:text-white"
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
          stopped
            ? "text-rose-950 dark:text-white"
            : "text-blue-900 dark:text-white"
        }`}
      >
        {formatLastUpdate(production)}

        <LiveAgo
          production={production}
          wrap
          className={`ml-2 text-xs font-medium ${
            stopped
              ? "text-rose-600 dark:text-rose-300"
              : "text-blue-700 dark:text-blue-300"
          }`}
        />
      </span>
    </div>
  );
}

/* ============================================================
   LAST 10 SHOTS + CYCLE TIME SUMMARY
   ============================================================ */

function CycleTimeLogStats({ stats, loading, error }) {
  const shots = Array.isArray(stats?.shots) ? stats.shots.slice(0, 10) : [];

  const summary = [
    { label: "Minimum Cycle Time", value: stats?.minCycleTimeSec },
    { label: "Maximum Cycle Time", value: stats?.maxCycleTimeSec },
    { label: "Average Cycle Time", value: stats?.avgCycleTimeSec },
  ];

  return (
    <div className="border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 sm:text-base">
          Last 10 Shots — Cycle Time Analysis
        </h3>
      </div>

      {loading && !stats ? (
        <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading last 10 shots...
        </div>
      ) : error && !stats ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Unable to load shot data: {String(error?.message || error)}
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              Showing the last received shot data.{" "}
              {String(error?.message || error)}
            </div>
          )}

          {/* Shots table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-[10px] uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:text-xs">
                <tr>
                  <th className="px-4 py-3">Shot</th>
                  <th className="px-4 py-3">Cycle Time</th>
                  <th className="px-4 py-3">Production Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {shots.map((shot, index) => {
                  const cycleTime = Number(shot.cycle_time_sec);

                  const hasCycleTime =
                    shot.cycle_time_sec !== null &&
                    shot.cycle_time_sec !== undefined &&
                    shot.cycle_time_sec !== "" &&
                    Number.isFinite(cycleTime);

                  return (
                    <tr
                      key={shot.id ?? shot.event_id ?? index}
                      className="transition-none hover:bg-blue-50/50 dark:hover:bg-blue-500/5"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                        {shots.length - index}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-blue-800 dark:text-blue-400">
                        {hasCycleTime ? `${cycleTime.toFixed(3)} sec` : "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                        {formatShotProductionTime(shot.production_time)}
                      </td>
                    </tr>
                  );
                })}

                {shots.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500"
                    >
                      {loading
                        ? "Loading shot records..."
                        : "No shot records available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cycle time summary */}
          <div className="mt-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-[11px]">
              Cycle Time Summary
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {summary.map((item) => {
                const valid =
                  item.value !== null &&
                  item.value !== undefined &&
                  item.value !== "" &&
                  Number.isFinite(Number(item.value));

                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs">
                      {item.label}
                    </p>

                    <p className="mt-2 text-xl font-extrabold tabular-nums text-blue-800 dark:text-blue-400 sm:text-2xl">
                      {valid ? Number(item.value).toFixed(3) : "—"}

                      {valid && (
                        <span className="ml-1 text-sm font-semibold text-blue-600 dark:text-blue-600">
                          sec
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================
   MACHINE CARD
   ============================================================ */

function ImmMachineCard({ config, machine, isRefreshing, now }) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = getMachineStatus(machine, now);
  const stopped = status === "stopped" || status === "error";

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm transition-none ${
        stopped
          ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <header
        className={`flex min-h-[60px] flex-col gap-2 px-4 py-3 transition-none sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
          stopped ? "bg-rose-700 dark:bg-rose-800" : "bg-blue-700"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Factory className="h-[18px] w-[18px] text-white" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold leading-tight text-white sm:text-base">
              {config.title}
            </h2>

            <p className="truncate text-xs text-white/60">
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

      {/* Compact stopped alert strip */}
      {production && stopped && <StoppedAlert production={production} />}

      {/* Card body */}
      {!production ? (
        <div className="p-5">
          {status === "loading" ? (
            <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <div className="min-w-0">
                <p className="font-semibold">Unable to load machine data</p>

                <p className="mt-1 break-words text-xs">
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
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              The API timestamp is in the future. Check the backend clock.
            </div>
          )}

          {/* Stale-data notice */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <p className="min-w-0 break-words text-xs">
                Showing the last received data. {String(error)}
              </p>
            </div>
          )}

          {/* Key metrics grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              icon={Layers}
              label="Shift Production"
              value={formatNumber(production.productionCount)}
              sub={
                production.shiftName ? `Shift ${production.shiftName}` : ""
              }
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

          {/* Last update row */}
          <LastUpdateRow production={production} status={status} />

          {isRefreshing && (
            <p className="text-[11px] text-slate-400">Refreshing…</p>
          )}
        </div>
      )}

      {/* Last 10 shots + cycle time analysis */}
      <CycleTimeLogStats
        stats={machine?.logStats}
        loading={machine?.logLoading}
        error={machine?.logError}
      />
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function MouldingOverviewView() {
  const { machines, isRefreshing, refresh } = useImmViewModel();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
    return () => clearInterval(id);
  }, []);

  const runningCount = IMM_MACHINES.filter(
    (config) => getMachineStatus(machines?.[config.key], now) === "running"
  ).length;

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
      <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 p-3 dark:bg-slate-950 sm:p-6">
        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          {/* Top header bar */}
          <header className="mb-5 flex w-full min-w-0 flex-row items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:px-5 sm:py-4">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 sm:h-11 sm:w-11">
                <Factory className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
                  APIPL
                </h1>

                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Injection Moulding Overview
                </p>
              </div>
            </div>

            {/* Controls stay in one row; theme toggle is always last */}
            <div className="flex shrink-0 flex-nowrap items-center justify-end gap-1.5 sm:gap-2.5">
              <div className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:text-white sm:gap-1.5 sm:px-3 sm:text-xs">
                {runningCount > 0 ? (
                  <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                )}

                <span className="whitespace-nowrap">
                  {runningCount}/{IMM_MACHINES.length} Running
                </span>
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                aria-label="Refresh dashboard"
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:px-3"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Summary tiles */}
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

          {/* Section heading */}
          <div className="mb-3 px-0.5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 sm:text-[13px]">
              Injection Moulding Machines
            </h2>
          </div>

          {/* Machine cards */}
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

          <footer className="mt-6 border-t border-slate-100 py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            ABHIJEET Smart Monitoring System
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}
