"use client";

import { useEffect, useRef, useState } from "react";
import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
import { Factory, Clock3, Wifi, WifiOff, Timer, Layers } from "lucide-react";

/* ============================================================
   TV SETTINGS
   ============================================================ */

// How long each slide stays on screen.
const SLIDE_DURATION_MS = 15 * 1000;

// Same rule as the main dashboard: no event for 15 min = stopped.
const MACHINE_TIMEOUT_MS = 10 * 60 * 1000;
const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;

// Clock / "x min ago" refresh rate.
const TICK_MS = 1000;

// Displayed value = actual value + offset (same as the main dashboard).
const SHIFT_PRODUCTION_OFFSET = 1;
const DAY_PRODUCTION_OFFSET = 1;

/* ============================================================
   HELPERS (same logic as the main dashboard)
   ============================================================ */

function getMachineTimestamp(production) {
  return production?.productionTime || production?.createdAt || null;
}

function parseApiTimestamp(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

// "17 Oct, 02:38:25 am" (used in the stopped message)
function formatLastUpdate(production) {
  const date = parseApiTimestamp(getMachineTimestamp(production));
  if (!date) return "—";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// Split version for the Last Update tile: time big, date small.
function formatLastUpdateParts(production) {
  const date = parseApiTimestamp(getMachineTimestamp(production));
  if (!date) return { time: "—", day: "" };

  return {
    time: date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    day: date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
    }),
  };
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
  if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

  return age <= MACHINE_TIMEOUT_MS ? "running" : "stopped";
}

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || seconds === "") return "—";

  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "—";

  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) return `${hours} hr ${minutes} min ${remainingSeconds} sec`;
  if (minutes > 0) return `${minutes} min ${remainingSeconds} sec`;
  return `${remainingSeconds} sec`;
}

// Actual value + offset, formatted (missing value counts as 0).
function formatCount(value, offset) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return "—";
  return (number + offset).toLocaleString("en-IN");
}

function getVariantLabel(production) {
  const variant =
    production?.variant ??
    production?.variantName ??
    production?.variantType ??
    production?.productVariant ??
    production?.variant_name ??
    null;

  if (variant == null || String(variant).trim() === "") return "—";
  return String(variant).trim();
}

// One status for a whole slide: the most serious status among its machines.
function getGroupStatus(statuses) {
  for (const bad of ["stopped", "error", "time-error"]) {
    if (statuses.includes(bad)) return bad;
  }
  if (statuses.includes("loading")) return "loading";
  return "running";
}

function getNotice(status, production, error, ago) {
  if (status === "stopped") {
    return `Machine stopped from ${formatLastUpdate(production)}${
      ago ? ` (${ago})` : ""
    }`;
  }
  if (status === "time-error") {
    return "The API timestamp is in the future. Check the backend clock.";
  }
  if (status === "error") {
    return typeof error === "string"
      ? error
      : error?.message || "Unable to load machine data.";
  }
  if (status === "loading") return "Loading machine data...";
  return `Live data · last production ${ago ?? "just now"}`;
}

/* ============================================================
   STATUS THEMES (all class names are static so Tailwind keeps them)
   ============================================================ */

const THEMES = {
  running: {
    label: "RUNNING",
    glow: "from-emerald-500/25",
    accent: "text-emerald-400",
    border: "border-emerald-400/30",
    pill: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40",
    dot: "bg-emerald-400",
    bar: "bg-emerald-400",
    pulse: false,
  },
  stopped: {
    label: "MACHINE STOPPED",
    glow: "from-rose-600/35",
    accent: "text-rose-400",
    border: "border-rose-400/40",
    pill: "bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/50",
    dot: "bg-rose-400",
    bar: "bg-rose-400",
    pulse: true,
  },
  error: {
    label: "API ERROR",
    glow: "from-amber-500/25",
    accent: "text-amber-300",
    border: "border-amber-400/30",
    pill: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    pulse: true,
  },
  "time-error": {
    label: "CHECK TIME",
    glow: "from-amber-500/25",
    accent: "text-amber-300",
    border: "border-amber-400/30",
    pill: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
    pulse: true,
  },
  loading: {
    label: "LOADING",
    glow: "from-slate-500/20",
    accent: "text-slate-300",
    border: "border-slate-400/20",
    pill: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-400/30",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
    pulse: true,
  },
};

/* ============================================================
   SMALL UI PIECES
   ============================================================ */

/*
  Measures the box it lives in and picks the largest font size that fits
  BOTH the height and the width, so a big number can never overflow its card.
*/
function FitNumber({ value, className = "" }) {
  const boxRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    const fit = () => {
      const { width, height } = element.getBoundingClientRect();
      const characters = Math.max(String(value).length, 1);
      const bySize = Math.min(height * 0.88, width / (characters * 0.66));
      setSize(Math.max(0, Math.floor(bySize)));
    };

    fit();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }

    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={boxRef}
      className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden"
    >
      <span
        className={`block whitespace-nowrap text-center font-black tabular-nums tracking-tight ${className}`}
        style={{
          fontSize: size,
          lineHeight: 1,
          visibility: size ? "visible" : "hidden",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function BigNumberCard({ label, value, theme, compact }) {
  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border bg-white/[0.04] shadow-xl shadow-black/30 ${
        theme.border
      } ${
        compact
          ? "rounded-[1.4vw] px-[1.2vw] pb-[1vh] pt-[1.2vh]"
          : "rounded-[1.8vw] px-[2vw] pb-[1.4vh] pt-[1.8vh]"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between gap-[0.8vw]">
        <span
          className={`truncate font-semibold uppercase text-slate-300 ${
            compact
              ? "text-[1.15vw] tracking-[0.16em]"
              : "text-[1.6vw] tracking-[0.22em]"
          }`}
        >
          {label}
        </span>
        <span
          className={`shrink-0 rounded-full ${theme.dot} ${
            compact ? "h-[0.8vw] w-[0.8vw]" : "h-[1.1vw] w-[1.1vw]"
          }`}
        />
      </div>

      <FitNumber value={value} className={theme.accent} />
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, sub, compact }) {
  return (
    <div
      className={`flex min-w-0 items-center overflow-hidden border border-white/10 bg-white/[0.04] ${
        compact
          ? "gap-[0.8vw] rounded-[1vw] px-[1vw] py-[0.9vh]"
          : "gap-[1.3vw] rounded-[1.4vw] px-[1.6vw] py-[1.3vh]"
      }`}
    >
      {!compact && (
        <div className="flex h-[3.6vw] w-[3.6vw] shrink-0 items-center justify-center rounded-[1vw] bg-white/10">
          <Icon className="h-[1.9vw] w-[1.9vw] text-slate-200" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-semibold uppercase text-slate-400 ${
            compact
              ? "text-[0.9vw] tracking-[0.14em]"
              : "text-[1.1vw] tracking-[0.2em]"
          }`}
        >
          {label}
        </p>
        <p
          className={`truncate font-bold leading-tight text-white ${
            compact ? "text-[1.5vw]" : "text-[2vw]"
          }`}
        >
          {value}
        </p>
        <p
          className={`truncate font-medium leading-tight text-slate-400 ${
            compact ? "min-h-[1.2vw] text-[0.95vw]" : "min-h-[1.5vw] text-[1.15vw]"
          }`}
        >
          {sub || " "}
        </p>
      </div>
    </div>
  );
}

/*
  One machine: header + status, message strip, Shift/Day numbers, info row.
  compact = true  -> used when two machines share one slide (side by side)
  compact = false -> used when one machine fills the whole slide
*/
function MachinePanel({ title, subtitle, machine, now, ready, compact }) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = ready ? getMachineStatus(machine, now) : "loading";
  const theme = THEMES[status] ?? THEMES.loading;
  const ago = ready && production ? formatAgo(production, now) : null;
  const lastUpdate = production ? formatLastUpdateParts(production) : null;
  const notice = getNotice(status, production, error, ago);

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col ${
        compact
          ? `gap-[1.2vh] rounded-[1.8vw] border bg-white/[0.03] p-[1.2vw] ${theme.border}`
          : "gap-[1.6vh]"
      }`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-[1vw]">
        <div className="min-w-0">
          <h2
            className={`truncate font-extrabold leading-tight tracking-tight ${
              compact ? "text-[2.6vw]" : "text-[3.4vw]"
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`truncate font-semibold text-slate-300 ${
                compact ? "text-[1.2vw]" : "text-[1.5vw]"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex shrink-0 items-center whitespace-nowrap rounded-full font-extrabold tracking-wide ${
            theme.pill
          } ${
            compact
              ? "gap-[0.6vw] px-[1.1vw] py-[0.8vh] text-[1.15vw]"
              : "gap-[0.9vw] px-[1.8vw] py-[1.2vh] text-[1.8vw]"
          }`}
        >
          <span
            className={`rounded-full ${theme.dot} ${
              theme.pulse ? "animate-pulse" : ""
            } ${compact ? "h-[0.85vw] w-[0.85vw]" : "h-[1.3vw] w-[1.3vw]"}`}
          />
          {theme.label}
        </div>
      </div>

      {/* Message strip (always one row, so layouts never jump) */}
      <div
        className={`shrink-0 truncate rounded-[1vw] border bg-white/[0.05] font-semibold ${
          theme.border
        } ${theme.accent} ${
          compact
            ? "px-[1vw] py-[0.8vh] text-[1.05vw]"
            : "px-[1.6vw] py-[1vh] text-[1.4vw]"
        }`}
      >
        {notice}
      </div>

      {/* Big numbers: take all remaining height, auto-fit */}
      <div
        className={`flex min-h-0 flex-1 ${compact ? "gap-[0.9vw]" : "gap-[1.6vw]"}`}
      >
        <BigNumberCard
          label="Shift Production"
          value={
            production
              ? formatCount(production.productionCount, SHIFT_PRODUCTION_OFFSET)
              : "—"
          }
          theme={theme}
          compact={compact}
        />
        <BigNumberCard
          label="Day Production"
          value={
            production
              ? formatCount(production.dayProduction, DAY_PRODUCTION_OFFSET)
              : "—"
          }
          theme={theme}
          compact={compact}
        />
      </div>

      {/* Info row */}
      <div
        className={`grid shrink-0 ${
          compact
            ? "grid-cols-[0.6fr_1.5fr_1fr] gap-[0.7vw]"
            : "grid-cols-[0.7fr_1.2fr_1.1fr] gap-[1.3vw]"
        }`}
      >
        <InfoTile
          icon={Layers}
          label="Shift"
          value={production?.shiftName ?? "—"}
          compact={compact}
        />
        <InfoTile
          icon={Timer}
          label="Cycle Time"
          value={production ? formatDuration(production.cycleTimeSec) : "—"}
          compact={compact}
        />
        <InfoTile
          icon={Clock3}
          label="Last Update"
          value={lastUpdate ? lastUpdate.time : "—"}
          sub={
            lastUpdate ? [lastUpdate.day, ago].filter(Boolean).join(" · ") : ""
          }
          compact={compact}
        />
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function TvPage() {
  const { machines } = useProductionViewModel();

  // null on the server and on the first client render, so both match
  // (prevents the hydration error). Set to the real time after mount.
  const [now, setNow] = useState(null);
  const ready = now !== null;
  const [index, setIndex] = useState(0);

  /*
    SLIDES. One entry = one full-screen slide, in rotation order.
    - 1 item  -> that machine fills the whole screen
    - 2 items -> both machines side by side on the same slide
  */
  const slides = [
    {
      key: "aero",
      title: "Aero Deflector",
      short: "Aero Deflector",
      items: [{ key: "aero", title: "Aero Deflector", machine: machines?.aeroDeflector }],
    },
    {
      key: "door",
      title: "W610 Rear Door Cladding",
      short: "Door Cladding",
      items: [
        { key: "rh", title: "RH", machine: machines?.rh },
        { key: "lh", title: "LH", machine: machines?.lh },
      ],
    },
    {
      key: "high",
      title: "W610 Rear Wheel Arch Cladding",
      short: "Arch · Pack C",
      badge: "PACK C · HIGH VARIANT",
      showVariant: true,
      items: [
        { key: "rhHigh", title: "RH", machine: machines?.rhHigh },
        { key: "lhHigh", title: "LH", machine: machines?.lhHigh },
      ],
    },
    {
      key: "low",
      title: "W610 Rear Wheel Arch Cladding",
      short: "Arch · Pack AB",
      badge: "PACK AB · LOW VARIANT",
      showVariant: true,
      items: [
        { key: "rhLow", title: "RH", machine: machines?.rhLow },
        { key: "lhLow", title: "LH", machine: machines?.lhLow },
      ],
    },
  ];

  const total = slides.length;

  // Live clock + status re-check.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Auto-rotate every 35 sec. Re-arms whenever the slide changes
  // (so manual arrow-key changes also restart the 35 sec).
  useEffect(() => {
    const id = setTimeout(
      () => setIndex((current) => (current + 1) % total),
      SLIDE_DURATION_MS
    );
    return () => clearTimeout(id);
  }, [index, total]);

  // Keyboard helpers: ← → change slide, F toggles full screen.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % total);
      } else if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + total) % total);
      } else if (event.key === "f" || event.key === "F") {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          document.documentElement.requestFullscreen?.();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  const statusOf = (machine) =>
    ready ? getMachineStatus(machine, now) : "loading";

  const slideStatus = (slide) =>
    getGroupStatus(slide.items.map((item) => statusOf(item.machine)));

  const slide = slides[index];
  const next = slides[(index + 1) % total];
  const pair = slide.items.length > 1;
  const theme = THEMES[slideStatus(slide)] ?? THEMES.loading;

  const allMachines = slides.flatMap((item) => item.items);
  const runningCount = allMachines.filter(
    (item) => statusOf(item.machine) === "running"
  ).length;

  const timeText = !ready
    ? "--:--:--"
    : new Date(now).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

  const dateText = !ready
    ? " "
    : new Date(now).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return (
    <main className="relative flex h-screen w-screen cursor-none select-none flex-col overflow-hidden bg-slate-950 text-white">
      <style>{`
        @keyframes tvProgress { from { width: 0%; } to { width: 100%; } }
        @keyframes tvFade {
          from { opacity: 0; transform: translateY(1.2vh); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background glow that follows the slide status */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${theme.glow} via-transparent to-transparent`}
      />
      <div className="pointer-events-none absolute -right-[10vw] -top-[20vh] h-[60vh] w-[60vh] rounded-full bg-indigo-600/20 blur-3xl" />

      {/* ---------- Top bar ---------- */}
      <header className="relative z-10 flex shrink-0 items-center justify-between px-[3vw] pt-[2vh]">
        <div className="flex min-w-0 items-center gap-[1.2vw]">
          <div className="flex h-[3.8vw] w-[3.8vw] shrink-0 items-center justify-center rounded-[1vw] bg-indigo-600 shadow-lg shadow-indigo-900/50">
            <Factory className="h-[2.1vw] w-[2.1vw] text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[2vw] font-extrabold leading-none tracking-wide">
              APIPL
            </p>
            <p className="mt-[0.4vh] truncate text-[1.1vw] font-medium text-slate-400">
              Assembly Production Monitoring
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[2vw]">
          <div className="flex items-center gap-[0.8vw] whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-[1.4vw] py-[0.9vh] text-[1.4vw] font-semibold">
            {runningCount > 0 ? (
              <Wifi className="h-[1.7vw] w-[1.7vw] text-emerald-400" />
            ) : (
              <WifiOff className="h-[1.7vw] w-[1.7vw] text-rose-400" />
            )}
            {runningCount}/{allMachines.length} Running
          </div>

          <div className="text-right">
            <p className="text-[2.4vw] font-bold leading-none tabular-nums">
              {timeText}
            </p>
            <p className="mt-[0.4vh] min-h-[1.4vw] text-[1.1vw] font-medium text-slate-400">
              {dateText}
            </p>
          </div>
        </div>
      </header>

      {/* ---------- Slide (re-mounts on change = fade-in) ---------- */}
      <section
        key={slide.key}
        className="relative z-10 flex min-h-0 flex-1 flex-col gap-[1.6vh] px-[3vw] pb-[1.2vh] pt-[1.6vh]"
        style={{ animation: "tvFade 600ms ease-out both" }}
      >
        {/* Group heading (only when two machines share the slide) */}
        {pair && (
          <div className="flex shrink-0 flex-wrap items-center gap-[1.2vw]">
            {slide.badge && (
              <span className="rounded-lg bg-white/10 px-[1vw] py-[0.5vh] text-[1.3vw] font-bold tracking-[0.18em] text-slate-200">
                {slide.badge}
              </span>
            )}
            <h1 className="min-w-0 truncate text-[3vw] font-extrabold leading-tight tracking-tight">
              {slide.title}
            </h1>
          </div>
        )}

        {/* Machines */}
        <div
          className={`flex min-h-0 flex-1 ${pair ? "gap-[1.6vw]" : ""}`}
        >
          {slide.items.map((item) => {
            const production = item.machine?.data ?? null;
            const subtitle =
              slide.showVariant && production
                ? `Variant: ${getVariantLabel(production)}`
                : null;

            return (
              <MachinePanel
                key={item.key}
                title={item.title}
                subtitle={subtitle}
                machine={item.machine}
                now={now}
                ready={ready}
                compact={pair}
              />
            );
          })}
        </div>
      </section>

      {/* ---------- Footer: progress + slide indicators ---------- */}
      <footer className="relative z-10 shrink-0 px-[3vw] pb-[1.4vh]">
        <div className="h-[0.7vh] w-full overflow-hidden rounded-full bg-white/10">
          <div
            key={`progress-${index}`}
            className={`h-full rounded-full ${theme.bar}`}
            style={{
              animation: `tvProgress ${SLIDE_DURATION_MS}ms linear forwards`,
            }}
          />
        </div>

        <div className="mt-[1.2vh] flex items-center justify-between gap-[1.5vw]">
          <div className="flex min-w-0 flex-wrap items-center gap-[0.6vw]">
            {slides.map((item, i) => {
              const itemTheme = THEMES[slideStatus(item)] ?? THEMES.loading;
              const active = i === index;

              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-[0.45vw] whitespace-nowrap rounded-full px-[0.9vw] py-[0.5vh] text-[1vw] font-semibold transition-colors ${
                    active
                      ? "bg-white/15 text-white ring-1 ring-white/30"
                      : "bg-white/[0.04] text-slate-500"
                  }`}
                >
                  <span
                    className={`h-[0.65vw] w-[0.65vw] rounded-full ${itemTheme.dot}`}
                  />
                  {item.short}
                </div>
              );
            })}
          </div>

          <p className="shrink-0 whitespace-nowrap text-[1.1vw] font-medium text-slate-400">
            Next: <span className="font-bold text-slate-200">{next.short}</span>
          </p>
        </div>

        <p className="mt-[0.6vh] text-center text-[0.9vw] text-slate-600">
          ABHIJEET Smart Monitoring System
        </p>
      </footer>
    </main>
  );
}