"use client";

import { useProductionViewModel } from "@/features/monitoring/view-models/use-production-view-model";
import { Clock3, Layers, Timer } from "lucide-react";

import { TvShell, TvSlide } from "@/features/tv/components/tv-shell";
import { TvHeader } from "@/features/tv/components/tv-header";
import { TvFooter } from "@/features/tv/components/tv-footer";
import { MachinePanel } from "@/features/tv/components/machine-panel";
import { useTvClock } from "@/features/tv/hooks/use-tv-clock";
import { useTvRotation } from "@/features/tv/hooks/use-tv-rotation";
import { THEMES, TV_BRAND } from "@/features/tv/tv.theme";
import {
  formatCount,
  formatDuration,
  getGroupStatus,
  getMachineStatus,
  getVariantLabel,
} from "@/features/tv/tv.helpers";

/* ============================================================
   TV SETTINGS  (Assembly)
   ============================================================ */

// How long each slide stays on screen.
const SLIDE_DURATION_MS = 8 * 1000;

// No production event for this long = machine stopped.
// (TV uses 10 min. The dashboard page uses 15 min.)
const MACHINE_TIMEOUT_MS = 10 * 60 * 1000;

// Displayed value = actual value + offset (same as the main dashboard).
const SHIFT_PRODUCTION_OFFSET = 1;
const DAY_PRODUCTION_OFFSET = 1;

/* ============================================================
   WHAT EACH MACHINE PANEL SHOWS
   ============================================================ */

function describeAssemblyMachine({ production, ago, lastUpdate, compact }) {
  return {
    bigNumbers: [
      {
        label: "Shift Production",
        value: production
          ? formatCount(production.productionCount, SHIFT_PRODUCTION_OFFSET)
          : "—",
      },
      {
        label: "Day Production",
        value: production
          ? formatCount(production.dayProduction, DAY_PRODUCTION_OFFSET)
          : "—",
      },
    ],

    infoTiles: [
      {
        icon: Layers,
        label: "Shift",
        value: production?.shiftName ?? "—",
        weight: compact ? 0.6 : 0.7,
      },
      {
        icon: Timer,
        label: "Cycle Time",
        value: production ? formatDuration(production.cycleTimeSec) : "—",
        weight: compact ? 1.5 : 1.2,
      },
      {
        icon: Clock3,
        label: "Last Update",
        value: lastUpdate ? lastUpdate.time : "—",
        sub: lastUpdate
          ? [lastUpdate.day, ago].filter(Boolean).join(" · ")
          : "",
        weight: compact ? 1 : 1.1,
      },
    ],
  };
}

/* ============================================================
   PAGE
   ============================================================ */

export default function TvPage() {
  // TV is ALWAYS live data (no date picker here). Passing null = today,
  // refreshed every 30 sec by the view model.
  const { machines } = useProductionViewModel(null);

  const { now, ready, timeText, dateText } = useTvClock();

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
      items: [
        { key: "aero", title: "Aero Deflector", machine: machines?.aeroDeflector },
      ],
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
  const { index } = useTvRotation({
    total,
    durationMs: SLIDE_DURATION_MS,
  });

  const statusOf = (machine) =>
    ready ? getMachineStatus(machine, now, MACHINE_TIMEOUT_MS) : "loading";

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

  return (
    <TvShell glowTheme={theme}>
      <TvHeader
        subtitle="Assembly Production Monitoring"
        runningCount={runningCount}
        total={allMachines.length}
        timeText={timeText}
        dateText={dateText}
      />

      {/* Slide (re-mounts on change = fade-in) */}
      <TvSlide key={slide.key} className="gap-[1.6vh]">
        {/* Group heading (only when two machines share the slide) */}
        {pair && (
          <div className="flex shrink-0 flex-wrap items-center gap-[1.2vw]">
            {slide.badge && (
              <span
                className={`rounded-lg px-[1vw] py-[0.5vh] text-[1.3vw] font-bold tracking-[0.18em] ${TV_BRAND.tag}`}
              >
                {slide.badge}
              </span>
            )}
            <h1 className="min-w-0 truncate text-[3vw] font-extrabold leading-tight tracking-tight">
              {slide.title}
            </h1>
          </div>
        )}

        {/* Machines */}
        <div className={`flex min-h-0 flex-1 ${pair ? "gap-[1.6vw]" : ""}`}>
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
                timeoutMs={MACHINE_TIMEOUT_MS}
                compact={pair}
                describe={describeAssemblyMachine}
              />
            );
          })}
        </div>
      </TvSlide>

      <TvFooter
        theme={theme}
        index={index}
        items={slides.map((item) => ({
          key: item.key,
          label: item.short,
          theme: THEMES[slideStatus(item)] ?? THEMES.loading,
        }))}
        nextLabel={next.short}
        durationMs={SLIDE_DURATION_MS}
      />
    </TvShell>
  );
}