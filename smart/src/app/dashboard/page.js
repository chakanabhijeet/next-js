"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
import { useMonitoringStore } from "@/features/monitoring/store/monitoring.store";
import {
  DEVICES,
  GROUPS,
  MACHINES,
  getMachinesByGroup,
  getMachinesByDevice,
} from "@/features/monitoring/config/machines.config";
import {
  CalendarDays,
  RefreshCw,
  Factory,
  Clock3,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";

const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;
const STATUS_TICK_MS = 15 * 1000;

const DAY_PRODUCTION_OFFSET = 1;
const SHIFT_PRODUCTION_OFFSET = 1;
const HISTORY_PRODUCTION_OFFSET = 0;

/* LIVE CLOCK */

let tickNow = Date.now();
let tickTimer = null;
const tickListeners = new Set();

function subscribeToTick(listener) {
  tickListeners.add(listener);

  if (!tickTimer) {
    tickNow = Date.now();

    tickTimer = setInterval(() => {
      tickNow = Date.now();
      tickListeners.forEach((notify) => notify());
    }, 1000);
  }

  return () => {
    tickListeners.delete(listener);

    if (tickListeners.size === 0 && tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  };
}

function getTickSnapshot() {
  return tickNow;
}

function useLiveNow() {
  return useSyncExternalStore(
    subscribeToTick,
    getTickSnapshot,
    getTickSnapshot
  );
}

function getTodayIST() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
}

function formatDateLabel(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00+05:30`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getMachineTimestamp(production) {
  return production?.productionTime || production?.createdAt || null;
}

function parseApiTimestamp(timestamp) {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? null : date;
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

  const total = Math.max(
    0,
    Math.floor((now - date.getTime()) / 1000)
  );

  if (total < 60) return `${total} sec ago`;

  const minutes = Math.floor(total / 60);

  if (minutes < 60) {
    return `${minutes} min ${String(total % 60).padStart(2, "0")} sec ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ${minutes % 60} min ago`;
  }

  return `${Math.floor(hours / 24)} d ${hours % 24} hr ago`;
}

function LiveAgo({ production, className = "", wrap = false }) {
  const now = useLiveNow();
  const text = formatAgo(production, now);

  if (!text) return null;

  return (
    <span className={`tabular-nums ${className}`}>
      {wrap ? ` (${text})` : text}
    </span>
  );
}

function getMachineStatus(machine, now) {
  const production = machine?.data;

  if (machine?.error || !production) {
    return machine?.error ? "error" : "loading";
  }

  if (production.historical) return "history";

  const timestamp = parseApiTimestamp(getMachineTimestamp(production));

  if (!timestamp) return "stopped";

  const age = now - timestamp.getTime();

  if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

  return age <= MACHINE_TIMEOUT_MS ? "running" : "stopped";
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

/* STATUS BADGE */

function MachineStatus({ status }) {
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

  if (status === "history") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-400/20 px-2.5 py-1 text-[10px] font-bold text-indigo-200 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
        HISTORY
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

/* STOPPED ALERT STRIP */

function StoppedAlert({ production }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 border-b border-rose-100 bg-rose-50 px-4 py-2 dark:border-rose-400/30 dark:bg-rose-900/50"
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

/* VARIANT ROW */

function MachineIdentity({ production, showVariant = false }) {
  if (!showVariant) return null;

  const variant =
    production?.variant ??
    production?.variantName ??
    production?.variantType ??
    production?.productVariant ??
    production?.variant_name ??
    null;

  const variantLabel =
    variant == null || String(variant).trim() === ""
      ? "—"
      : String(variant).trim();

  return (
    <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800/60">
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
        Variant:{" "}
        <span className="text-blue-700 dark:text-white">
          {variantLabel}
        </span>
      </p>
    </div>
  );
}

/* METRIC ROW */

function MetricRow({
  label,
  value,
  highlight = false,
  stopped = false,
}) {
  return (
    <div
      className={`flex min-h-[44px] items-center justify-between gap-3 border-b px-4 py-2.5 last:border-b-0 ${
        stopped
          ? "border-rose-200 dark:border-rose-800/70"
          : "border-slate-100 dark:border-slate-700/70"
      }`}
    >
      <span
        className={`text-sm ${
          stopped
            ? "text-rose-800 dark:text-rose-100"
            : "text-slate-500 dark:text-white"
        }`}
      >
        {label}
      </span>

      <span
        className={
          highlight
            ? `text-right text-lg font-bold ${
                stopped
                  ? "text-rose-600 dark:text-white"
                  : "text-blue-700 dark:text-white"
              }`
            : `text-right text-sm font-semibold ${
                stopped
                  ? "text-rose-900 dark:text-white"
                  : "text-slate-700 dark:text-white"
              }`
        }
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

/* LAST UPDATE FOOTER */

function LastUpdateRow({ production, status }) {
  const stopped = status === "stopped";

  return (
    <div
      className={`mx-3 mb-3 mt-2 flex min-h-[42px] flex-col gap-0.5 rounded-xl px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2 ${
        stopped
          ? "bg-rose-100 dark:bg-rose-900/70"
          : "bg-blue-50 dark:bg-blue-500/10"
      }`}
    >
      <span
        className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${
          stopped
            ? "text-rose-800 dark:text-rose-100"
            : "text-blue-700 dark:text-white"
        }`}
      >
        <Clock3 className="h-3.5 w-3.5" />
        Last Update

        {status === "running" && (
          <span className="relative ml-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        )}
      </span>

      <span className="text-left sm:text-right">
        <span
          className={`block text-xs font-bold ${
            stopped
              ? "text-rose-950 dark:text-white"
              : "text-blue-900 dark:text-white"
          }`}
        >
          {formatLastUpdate(production)}
        </span>

        <LiveAgo
          production={production}
          className={`text-[11px] font-semibold ${
            stopped
              ? "text-rose-500 dark:text-rose-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        />
      </span>
    </div>
  );
}

/* MACHINE CARD */

function MachineCard({
  title,
  badge,
  machine,
  isRefreshing,
  now,
  showVariant = false,
}) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = getMachineStatus(machine, now);
  const stopped = status === "stopped";
  const historical = status === "history";

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border shadow-md ${
        stopped
          ? "border-rose-300 bg-rose-50 shadow-rose-900/10 dark:border-rose-700 dark:bg-rose-950 dark:shadow-black/20"
          : "border-slate-200 bg-white shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20"
      }`}
    >
      <header
        className={`flex min-h-[52px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
          stopped ? "bg-rose-700 dark:bg-rose-800" : "bg-blue-700"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <Factory className="h-3.5 w-3.5 text-white" />
          </div>

          <h2 className="min-w-0 truncate text-sm font-semibold leading-tight text-white sm:text-[15px]">
            {title}
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          {badge && (
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
              {badge}
            </span>
          )}

          <MachineStatus status={status} />
        </div>
      </header>

      {!production ? (
        <div className="p-4">
          {status === "loading" ? (
            <div className="flex min-h-20 items-center justify-center gap-2 text-sm text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <div className="min-w-0">
                <p className="font-semibold">
                  Unable to load machine data
                </p>

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
        <>
          {status === "time-error" && (
            <div className="mx-3 mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              The API timestamp is in the future. Check the backend clock.
            </div>
          )}

          {stopped && <StoppedAlert production={production} />}

          <MachineIdentity
            production={production}
            showVariant={showVariant}
          />

          {historical ? (
            <>
              <MetricRow
                stopped={stopped}
                label="Day Production"
                value={(
                  Number(production.dayProduction ?? 0) +
                  HISTORY_PRODUCTION_OFFSET
                ).toLocaleString("en-IN")}
                highlight
              />

              {(production.shifts ?? []).map((shift) => (
                <MetricRow
                  stopped={stopped}
                  key={shift.name}
                  label={shift.name}
                  value={(
                    Number(shift.count ?? 0) + HISTORY_PRODUCTION_OFFSET
                  ).toLocaleString("en-IN")}
                />
              ))}

              {Number(production.dayProduction ?? 0) === 0 &&
                (production.shifts ?? []).every(
                  (s) => Number(s.count ?? 0) === 0
                ) && (
                  <div className="mx-3 my-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                    No production recorded for this date.
                  </div>
                )}

              <div className="mx-3 mb-3 mt-2 flex min-h-[42px] items-center justify-between gap-2 rounded-xl bg-indigo-50 px-3 py-2 dark:bg-indigo-500/10">
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Data for
                </span>

                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-200">
                  {formatDateLabel(production.date)}
                </span>
              </div>
            </>
          ) : (
            <>
              <MetricRow
                label="Shift"
                value={production.shiftName}
                stopped={stopped}
              />

              <MetricRow
                stopped={stopped}
                label="Shift Production"
                value={(
                  Number(production.productionCount ?? 0) +
                  SHIFT_PRODUCTION_OFFSET
                ).toLocaleString("en-IN")}
                highlight
              />

              <MetricRow
                stopped={stopped}
                label="Day Production"
                value={(
                  Number(production.dayProduction ?? 0) +
                  DAY_PRODUCTION_OFFSET
                ).toLocaleString("en-IN")}
                highlight
              />

              <MetricRow
                stopped={stopped}
                label="Cycle Time"
                value={formatDuration(production.cycleTimeSec)}
              />

              <LastUpdateRow production={production} status={status} />
            </>
          )}

          {isRefreshing && (
            <p className="px-4 pb-2 text-[11px] text-slate-400">
              Refreshing…
            </p>
          )}
        </>
      )}
    </section>
  );
}

/* ASSEMBLY GROUP */

function AssemblyGroup({ items, isRefreshing, now }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <MachineCard
            key={item.key}
            title={item.title}
            badge={item.badge}
            machine={item.machine}
            isRefreshing={isRefreshing}
            now={now}
          />
        ))}
      </div>
    </section>
  );
}

/* VARIANT GROUP */

function VariantGroup({ sections, isRefreshing, now }) {
  return (
    <section className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {sections.map((section) => (
        <div key={section.label} className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3 px-1">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${section.badgeClass}`}
            >
              {section.label}
            </span>

            <div className="hidden h-px flex-1 bg-slate-100 dark:bg-slate-800 sm:block" />
          </div>

          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
            {section.items.map((item) => (
              <MachineCard
                key={item.key}
                title={item.title}
                badge={item.badge}
                machine={item.machine}
                isRefreshing={isRefreshing}
                now={now}
                showVariant={item.showVariant ?? true}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* PAGE */

export default function DashboardPage() {
  // Selected date lives in the Zustand store ("" = today / live).
  const selectedDate = useMonitoringStore((state) => state.selectedDate);
  const setSelectedDate = useMonitoringStore((state) => state.setSelectedDate);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(getTodayIST());

    const id = setInterval(() => setToday(getTodayIST()), 60 * 1000);

    return () => clearInterval(id);
  }, []);

  const isHistory = selectedDate !== "" && selectedDate !== today;

  const { machines, isRefreshing, refresh, wheelArchTotal } =
    useProductionViewModel(isHistory ? selectedDate : null);

  const handleDateChange = (event) => {
    const value = event.target.value;

    if (!value || !today || value >= today) {
      setSelectedDate("");
      return;
    }

    setSelectedDate(value);
  };

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);

    return () => clearInterval(id);
  }, []);

  const buildItems = (groupId) =>
    getMachinesByGroup(groupId).map((config) => ({
      key: config.key,
      title: config.title,
      badge: config.badge,
      showVariant: config.showVariant ?? false,
      machine: machines?.[config.key],
    }));

  const aeroItems = buildItems(GROUPS.AERO.id);
  const doorCladdingItems = buildItems(GROUPS.DOOR_CLADDING.id);

  const variantSections = [
    GROUPS.WHEEL_ARCH_HIGH,
    GROUPS.WHEEL_ARCH_LOW,
  ].map((group) => ({
    label: group.label,
    badgeClass: group.badgeClass,
    items: buildItems(group.id),
  }));

  const allMachines = MACHINES.map((config) => machines?.[config.key]);

  const variantMachines = getMachinesByDevice(DEVICES.WHEEL_ARCH).map(
    (config) => machines?.[config.key]
  );

  const variantsReady =
    isHistory &&
    variantMachines.every((machine) => machine?.data?.historical);

  const assignedTotal = variantMachines.reduce(
    (sum, machine) => sum + Number(machine?.data?.dayProduction ?? 0),
    0
  );

  const unassignedTotal =
    variantsReady && wheelArchTotal != null
      ? wheelArchTotal - assignedTotal
      : 0;

  const runningCount = allMachines.filter(
    (machine) => getMachineStatus(machine, now) === "running"
  ).length;

  return (
    <DashboardLayout>
      <main className="assembly-dashboard min-h-screen min-w-0 overflow-x-hidden bg-slate-50 p-3 dark:bg-slate-950 sm:p-6">
        {/* INSTANT THEME SWITCHING */}
        <style jsx global>{`
          .assembly-dashboard,
          .assembly-dashboard *,
          .assembly-dashboard *::before,
          .assembly-dashboard *::after {
            transition: none !important;
          }
        `}</style>

        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          {/* DASHBOARD HEADER */}
          <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 sm:h-11 sm:w-11">
                <Factory className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                  APIPL
                </h1>

                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Assembly Production Dashboard
                </p>
              </div>
            </div>

            {/* HEADER CONTROLS */}
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
              {isHistory ? (
                <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />

                  <span className="whitespace-nowrap">
                    Viewing {formatDateLabel(selectedDate)}
                  </span>
                </div>
              ) : (
                <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-white">
                  {runningCount > 0 ? (
                    <Wifi className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                  )}

                  <span className="whitespace-nowrap">
                    {runningCount}/{allMachines.length} Running
                  </span>
                </div>
              )}

              <label className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-blue-600" />

                <input
                  type="date"
                  value={selectedDate || today}
                  max={today || undefined}
                  onChange={handleDateChange}
                  className="w-[115px] bg-transparent text-xs font-semibold text-slate-600 outline-none dark:text-white dark:[color-scheme:dark]"
                  aria-label="Select production date"
                />
              </label>

              {isHistory && (
                <button
                  type="button"
                  onClick={() => setSelectedDate("")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  Back to Today
                </button>
              )}

              <button
                type="button"
                onClick={refresh}
                disabled={isRefreshing}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
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

          {/* ASSEMBLY OVERVIEW */}
          <div className="mb-3 px-0.5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 sm:text-[13px]">
              Assembly Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 2xl:grid-cols-3">
            {aeroItems.map((item) => (
              <MachineCard
                key={item.key}
                title={item.title}
                badge={item.badge}
                machine={item.machine}
                isRefreshing={isRefreshing}
                now={now}
              />
            ))}

            <div className="min-w-0 2xl:col-span-2">
              <AssemblyGroup
                items={doorCladdingItems}
                isRefreshing={isRefreshing}
                now={now}
              />
            </div>
          </div>

          {/* VARIANT GROUP */}
          <div className="mt-4 min-w-0 sm:mt-5">
            <VariantGroup
              sections={variantSections}
              isRefreshing={isRefreshing}
              now={now}
            />
          </div>

          {/* WHEEL ARCH TOTAL WARNING */}
          {unassignedTotal !== 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              <p className="font-semibold">
                Wheel Arch totals do not match
              </p>

              <p className="mt-1 text-xs leading-relaxed">
                {unassignedTotal > 0
                  ? `The whole device total for ${formatDateLabel(
                      selectedDate
                    )} is ${wheelArchTotal.toLocaleString(
                      "en-IN"
                    )}, but only ${assignedTotal.toLocaleString(
                      "en-IN"
                    )} is assigned to a station and variant (RH / LH, HIGH / LOW). ${unassignedTotal.toLocaleString(
                      "en-IN"
                    )} parts have no matching station or variant in the data.`
                  : `The RH / LH and HIGH / LOW cards add up to ${assignedTotal.toLocaleString(
                      "en-IN"
                    )}, which is more than the whole device total of ${wheelArchTotal.toLocaleString(
                      "en-IN"
                    )}.`}
              </p>
            </div>
          )}

          {/* FOOTER */}
          <footer className="mt-6 border-t border-slate-100 py-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            ABHIJEET Smart Monitoring System
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}