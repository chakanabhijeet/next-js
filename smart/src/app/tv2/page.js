"use client";

import { useEffect, useRef, useState } from "react";
import {
  IMM_MACHINES,
  useImmViewModel,
} from "@/features/moulding/view-models/use-imm-view-model";
import { Clock3, Hash, Timer, Wifi, WifiOff } from "lucide-react";

/* ============================================================
   TV SETTINGS
   ============================================================ */

// With more than one machine, each stays on screen this long.
// (With one machine there is no rotation.)
const SLIDE_DURATION_MS = 15 * 1000;

// No production event for this long = machine stopped.
const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;
const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;

// Clock / "x min ago" refresh rate.
const TICK_MS = 1000;

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

// "17 Oct, 02:38:25 am" (used in the stopped message)
function formatLastUpdate(production) {
  const date = parseTimestamp(getMachineTimestamp(production));
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
  const date = parseTimestamp(getMachineTimestamp(production));
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

function formatCount(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number.toLocaleString("en-IN") : "—";
}

// Two decimals: 68.333 -> "68.33 sec"
function formatCycleTime(seconds) {
  if (seconds === null || seconds === undefined) return "—";

  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "—";

  return `${value.toFixed(2)} sec`;
}

function textOrDash(value) {
  const text = value == null ? "" : String(value).trim();
  return text === "" ? "—" : text;
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

// One status for the whole screen: the most serious among all machines.
function getGroupStatus(statuses) {
  for (const bad of ["stopped", "error", "time-error"]) {
    if (statuses.includes(bad)) return bad;
  }
  if (statuses.includes("loading")) return "loading";
  return "running";
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

function BigNumberCard({ label, value, hint, theme }) {
  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[1.8vw] border bg-white/[0.04] px-[2vw] pb-[1.4vh] pt-[1.8vh] shadow-xl shadow-black/30 ${theme.border}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-[0.8vw]">
        <span className="truncate text-[1.6vw] font-semibold uppercase tracking-[0.22em] text-slate-300">
          {label}
        </span>
        <span
          className={`h-[1.1vw] w-[1.1vw] shrink-0 rounded-full ${theme.dot}`}
        />
      </div>

      <FitNumber value={value} className={theme.accent} />

      <p className="min-h-[1.6vw] shrink-0 truncate text-center text-[1.3vw] font-medium text-slate-400">
        {hint || " "}
      </p>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex min-w-0 items-center gap-[1.3vw] overflow-hidden rounded-[1.4vw] border border-white/10 bg-white/[0.04] px-[1.6vw] py-[1.3vh]">
      <div className="flex h-[3.6vw] w-[3.6vw] shrink-0 items-center justify-center rounded-[1vw] bg-white/10">
        <Icon className="h-[1.9vw] w-[1.9vw] text-slate-200" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[1.1vw] font-semibold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <p className="truncate text-[2vw] font-bold leading-tight text-white">
          {value}
        </p>
        <p className="min-h-[1.5vw] truncate text-[1.15vw] font-medium leading-tight text-slate-400">
          {sub || " "}
        </p>
      </div>
    </div>
  );
}

/* One machine filling the whole slide */
function MachineSlide({ config, machine, now, ready }) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = ready ? getMachineStatus(machine, now) : "loading";
  const theme = THEMES[status] ?? THEMES.loading;
  const ago = ready && production ? formatAgo(production, now) : null;
  const lastUpdate = production ? formatLastUpdateParts(production) : null;
  const notice = getNotice(status, production, error, ago);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[1.6vh]">
      {/* Title + status */}
      <div className="flex shrink-0 items-center justify-between gap-[1vw]">
        <div className="min-w-0">
          <div className="flex min-h-[3.2vh] flex-wrap items-center gap-[1vw]">
            {config.tonnage && (
              <span className="rounded-lg bg-white/10 px-[0.9vw] py-[0.4vh] text-[1.2vw] font-bold tracking-[0.2em] text-slate-200">
                {config.tonnage}
              </span>
            )}
            {production?.shiftName && (
              <span className="rounded-lg bg-white/10 px-[0.9vw] py-[0.4vh] text-[1.2vw] font-bold tracking-[0.2em] text-slate-200">
                SHIFT {production.shiftName}
              </span>
            )}
          </div>
          <h1 className="mt-[0.6vh] truncate text-[3.4vw] font-extrabold leading-tight tracking-tight">
            {config.title}
          </h1>
        </div>

        <div
          className={`flex shrink-0 items-center gap-[0.9vw] whitespace-nowrap rounded-full px-[1.8vw] py-[1.2vh] text-[1.8vw] font-extrabold tracking-wide ${theme.pill}`}
        >
          <span
            className={`h-[1.3vw] w-[1.3vw] rounded-full ${theme.dot} ${
              theme.pulse ? "animate-pulse" : ""
            }`}
          />
          {theme.label}
        </div>
      </div>

      {/* Message strip (always one row, so the layout never jumps) */}
      <div
        className={`shrink-0 truncate rounded-[1vw] border bg-white/[0.05] px-[1.6vw] py-[1vh] text-[1.4vw] font-semibold ${theme.border} ${theme.accent}`}
      >
        {notice}
      </div>

      {/* Big numbers: take all remaining height, auto-fit */}
      <div className="flex min-h-0 flex-1 gap-[1.6vw]">
        <BigNumberCard
          label="Shift Production"
          value={production ? formatCount(production.productionCount) : "—"}
          hint={production?.shiftName ? `Shift ${production.shiftName}` : ""}
          theme={theme}
        />
        <BigNumberCard
          label="Day Production"
          value={production ? formatCount(production.dayProduction) : "—"}
          hint="Total for today"
          theme={theme}
        />
      </div>

      {/* Info row */}
      <div className="grid shrink-0 grid-cols-[1.1fr_1fr_1.2fr] gap-[1.3vw]">
        <InfoTile
          icon={Timer}
          label="Cycle Time"
          value={production ? formatCycleTime(production.cycleTimeSec) : "—"}
        />
        <InfoTile
          icon={Hash}
          label="Mould No."
          value={production ? textOrDash(production.moldNo) : "—"}
        />
        <InfoTile
          icon={Clock3}
          label="Last Update"
          value={lastUpdate ? lastUpdate.time : "—"}
          sub={
            lastUpdate ? [lastUpdate.day, ago].filter(Boolean).join(" · ") : ""
          }
        />
      </div>
    </div>
  );
}

/* ============================================================
   VIEW: Injection Moulding TV screen
   ============================================================ */

export default function MouldingTvView() {
  // TV is ALWAYS live data (refreshed every 15 sec by the view model).
  const { machines } = useImmViewModel();

  // null on the server and on the first client render, so both match
  // (prevents a hydration error). Set to the real time after mount.
  const [now, setNow] = useState(null);
  const ready = now !== null;
  const [index, setIndex] = useState(0);

  const slides = IMM_MACHINES;
  const total = slides.length;
  const multiple = total > 1;

  // Live clock + status re-check.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Rotate between machines (only when there is more than one).
  useEffect(() => {
    if (!multiple) return undefined;

    const id = setTimeout(
      () => setIndex((current) => (current + 1) % total),
      SLIDE_DURATION_MS
    );
    return () => clearTimeout(id);
  }, [index, total, multiple]);

  // Keyboard helpers: ← → change machine, F toggles full screen.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "ArrowRight" && multiple) {
        setIndex((current) => (current + 1) % total);
      } else if (event.key === "ArrowLeft" && multiple) {
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
  }, [total, multiple]);

  const statusOf = (config) =>
    ready ? getMachineStatus(machines?.[config.key], now) : "loading";

  const current = slides[index];
  const next = slides[(index + 1) % total];
  const theme = THEMES[statusOf(current)] ?? THEMES.loading;

  const runningCount = slides.filter(
    (config) => statusOf(config) === "running"
  ).length;

  // Glow follows the worst status when rotating, the machine's own otherwise
  const glowTheme = multiple
    ? THEMES[getGroupStatus(slides.map(statusOf))] ?? THEMES.loading
    : theme;

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

      {/* Background glow that follows the status */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${glowTheme.glow} via-transparent to-transparent`}
      />
      <div className="pointer-events-none absolute -right-[10vw] -top-[20vh] h-[60vh] w-[60vh] rounded-full bg-indigo-600/20 blur-3xl" />

      {/* ---------- Top bar ---------- */}
      <header className="relative z-10 flex shrink-0 items-center justify-between px-[3vw] pt-[2vh]">
        <div className="flex min-w-0 items-center gap-[1.2vw]">
          <img
            src="/logo.png"
            alt="APIPL logo"
            className="h-[3.8vw] w-auto max-w-[9vw] shrink-0 rounded-[1vw] bg-white object-contain p-[0.4vw]"
          />
          <div className="min-w-0">
            <p className="text-[2vw] font-extrabold leading-none tracking-wide">
              APIPL
            </p>
            <p className="mt-[0.4vh] truncate text-[1.1vw] font-medium text-slate-400">
              Injection Moulding Monitoring
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
            {runningCount}/{total} Running
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

      {/* ---------- Machine (re-mounts on change = fade-in) ---------- */}
      <section
        key={current.key}
        className="relative z-10 flex min-h-0 flex-1 flex-col px-[3vw] pb-[1.2vh] pt-[1.6vh]"
        style={{ animation: "tvFade 600ms ease-out both" }}
      >
        <MachineSlide
          config={current}
          machine={machines?.[current.key]}
          now={now}
          ready={ready}
        />
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="relative z-10 shrink-0 px-[3vw] pb-[1.4vh]">
        {multiple ? (
          <>
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
                {slides.map((config, i) => {
                  const itemTheme = THEMES[statusOf(config)] ?? THEMES.loading;
                  const active = i === index;

                  return (
                    <div
                      key={config.key}
                      className={`flex items-center gap-[0.45vw] whitespace-nowrap rounded-full px-[0.9vw] py-[0.5vh] text-[1vw] font-semibold transition-colors ${
                        active
                          ? "bg-white/15 text-white ring-1 ring-white/30"
                          : "bg-white/[0.04] text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-[0.65vw] w-[0.65vw] rounded-full ${itemTheme.dot}`}
                      />
                      {config.title}
                    </div>
                  );
                })}
              </div>

              <p className="shrink-0 whitespace-nowrap text-[1.1vw] font-medium text-slate-400">
                Next:{" "}
                <span className="font-bold text-slate-200">{next.title}</span>
              </p>
            </div>
          </>
        ) : (
          <div className="h-[0.7vh] w-full rounded-full bg-white/10">
            <div className={`h-full w-full rounded-full opacity-60 ${theme.bar}`} />
          </div>
        )}

        <p className="mt-[0.8vh] text-center text-[0.9vw] text-slate-600">
          ABHIJEET Smart Monitoring System
        </p>
      </footer>
    </main>
  );
}