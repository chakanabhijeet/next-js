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
} from "lucide-react";

// A machine is "running" if its last production event is newer than this.
// Fixed 15 minutes for EVERY machine (independent of cycle time).
const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
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

// Evaluated separately for every machine card.
function getMachineStatus(machine, now) {
  const production = machine?.data;

  if (machine?.error || !production) {
    return machine?.error ? "error" : "loading";
  }

  const timestamp = parseApiTimestamp(getMachineTimestamp(production));

  // No valid timestamp = treat as stopped (red)
  if (!timestamp) return "stopped";

  const age = now - timestamp.getTime();

  // Timestamp meaningfully in the future = real clock problem
  if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

  // No update for more than 15 minutes = stopped (red)
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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-[11px] ${colors}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

/* Only cards with showVariant=true display the variant row. */
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
    <div className="border-b border-slate-100 px-4 py-3">
      <p className="break-words text-sm font-bold text-slate-900 sm:text-base">
        Variant: {variantLabel}
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
        className={`min-w-0 break-words text-sm ${
          stopped ? "text-rose-700" : "text-slate-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`min-w-0 break-words text-right font-semibold ${
          highlight
            ? `text-base sm:text-lg ${stopped ? "text-rose-700" : "text-violet-600"}`
            : `text-sm ${stopped ? "text-rose-800" : "text-slate-800"}`
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

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
  const stopped = status === "stopped" || status === "error";
  const ago = production ? formatAgo(production, now) : null;

  return (
    <section
      className={`min-w-0 overflow-hidden rounded-2xl border shadow-sm ${
        stopped ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white"
      }`}
    >
      <header
        className={`flex min-h-[54px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
          stopped ? "bg-rose-700" : "bg-indigo-600"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
            <Factory className="h-4 w-4 text-white" />
          </div>
          <h2 className="min-w-0 text-sm font-bold leading-tight text-white sm:text-base">
            {title}
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          {badge && (
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
              {badge}
            </span>
          )}
          <MachineStatus status={status} />
        </div>
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
        <>
          {status === "time-error" && (
            <div className="m-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              The API timestamp is in the future. Check the backend clock.
            </div>
          )}

          {status === "stopped" && (
            <div className="m-3 break-words rounded-lg border border-rose-200 bg-rose-100 p-3 text-sm text-rose-800">
              Machine stopped from {formatLastUpdate(production)}
              {ago ? ` (${ago})` : ""}
            </div>
          )}

          <MachineIdentity production={production} showVariant={showVariant} />

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
            className={`mx-3 mt-3 flex min-h-[46px] flex-col gap-1 rounded-lg px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2 ${
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
              className={`min-w-0 break-words text-left text-xs font-bold sm:text-right ${
                stopped ? "text-rose-800" : "text-violet-800"
              }`}
            >
              {formatLastUpdate(production)}
              {ago && (
                <span className="block font-medium opacity-80">{ago}</span>
              )}
            </span>
          </div>

          <div className="pb-3" />

          {isRefreshing && (
            <p className="px-4 pb-3 text-xs text-slate-400">Refreshing...</p>
          )}
        </>
      )}
    </section>
  );
}

function AssemblyGroup({
  rh,
  lh,
  rhTitle = "RH Assembly",
  lhTitle = "LH Assembly",
  isRefreshing,
  now,
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        <MachineCard
          title={rhTitle}
          machine={rh}
          isRefreshing={isRefreshing}
          now={now}
        />
        <MachineCard
          title={lhTitle}
          machine={lh}
          isRefreshing={isRefreshing}
          now={now}
        />
      </div>
    </section>
  );
}

// One common card. Machines are grouped into labelled sections
// (HIGH together, LOW together) for easier reading.
// Only cards inside this group show the Variant row.
function VariantGroup({ sections, isRefreshing, now }) {
  return (
    <section className="min-w-0 space-y-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      {sections.map((section) => (
        <div key={section.label} className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3 px-1">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide ${section.badgeClass}`}
            >
              {section.label}
            </span>
            <div className="hidden h-px flex-1 bg-slate-200 sm:block" />
          </div>

          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
            {section.items.map((item) => (
              <MachineCard
                key={item.title}
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
  const rhHigh = machines?.rhHigh;
  const rhLow = machines?.rhLow;
  const lhHigh = machines?.lhHigh;
  const lhLow = machines?.lhLow;

  const allMachines = [aero, rh, lh, rhHigh, rhLow, lhHigh, lhLow];

  const runningCount = allMachines.filter(
    (machine) => getMachineStatus(machine, now) === "running"
  ).length;

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
                  Assembly Production Dashboard
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
                  {runningCount}/{allMachines.length} Running
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

          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800 sm:text-lg">
              Assembly Overview
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Live production metrics from your production API.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 2xl:grid-cols-3">
            <MachineCard
              title="Aero Deflector"
              machine={aero}
              isRefreshing={isRefreshing}
              now={now}
            />

            <div className="min-w-0 2xl:col-span-2">
              <AssemblyGroup
                rh={rh}
                lh={lh}
                rhTitle="W610 Rear Door Cladding RH"
                lhTitle="W610 Rear Door Cladding LH"
                isRefreshing={isRefreshing}
                now={now}
              />
            </div>
          </div>

          <div className="mt-4 min-w-0 sm:mt-5">
            <VariantGroup
              sections={[
                {
                  label: "PACK C · HIGH VARIANT",
                  badgeClass: "bg-indigo-50 text-indigo-700",
                  items: [
                    {
                      title: "W610 Rear Wheel Arch Cladding RH",
                      badge: "PACK C",
                      machine: rhHigh,
                      showVariant: true,
                    },
                    {
                      title: "W610 Rear Wheel Arch Cladding LH",
                      badge: "PACK C",
                      machine: lhHigh,
                      showVariant: true,
                    },
                  ],
                },
                {
                  label: "PACK AB · LOW VARIANT",
                  badgeClass: "bg-sky-50 text-sky-700",
                  items: [
                    {
                      title: "W610 Rear Wheel Arch Cladding RH",
                      badge: "PACK AB",
                      machine: rhLow,
                      showVariant: true,
                    },
                    {
                      title: "W610 Rear Wheel Arch Cladding LH",
                      badge: "PACK AB",
                      machine: lhLow,
                      showVariant: true,
                    },
                  ],
                },
              ]}
              isRefreshing={isRefreshing}
              now={now}
            />
          </div>

          <footer className="mt-6 border-t border-slate-200 py-4 text-center text-xs text-slate-400">
            ABHIJEET Smart Monitoring System
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}