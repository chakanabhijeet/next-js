// "use client";

// import {
//   IMM_MACHINES,
//   useImmViewModel,
// } from "@/features/moulding/view-models/use-imm-view-model";
// import { Clock3, Hash, Timer } from "lucide-react";

// import { TvShell, TvSlide } from "@/features/tv/components/tv-shell";
// import { TvHeader } from "@/features/tv/components/tv-header";
// import { TvFooter } from "@/features/tv/components/tv-footer";
// import { MachinePanel } from "@/features/tv/components/machine-panel";
// import { useTvClock } from "@/features/tv/hooks/use-tv-clock";
// import { useTvRotation } from "@/features/tv/hooks/use-tv-rotation";
// import { THEMES } from "@/features/tv/tv.theme";
// import {
//   formatCount,
//   formatCycleTime,
//   getGroupStatus,
//   getMachineStatus,
//   textOrDash,
// } from "@/features/tv/tv.helpers";

// /* ============================================================ 
//    TV SETTINGS  (Moulding)
//    ============================================================ */

// // With more than one machine, each stays on screen this long.
// // (With one machine there is no rotation.)
// const SLIDE_DURATION_MS = 8 * 1000;

// // No production event for this long = machine stopped.
// const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;

// /* ============================================================
//    WHAT EACH MACHINE PANEL SHOWS
//    ============================================================ */

// // Builds the "what to show" function for one machine (needs its config).
// function makeDescribeMouldingMachine(config) {
//   return function describeMouldingMachine({ production, ago, lastUpdate }) {
//     // Small tags above the title: tonnage (if set) and current shift
//     const badges = [];
//     if (config.tonnage) badges.push(config.tonnage);
//     if (production?.shiftName) badges.push(`SHIFT ${production.shiftName}`);

//     return {
//       badges,

//       bigNumbers: [
//         {
//           label: "Shift Production",
//           value: production ? formatCount(production.productionCount) : "—",
//           hint: production?.shiftName ? `Shift ${production.shiftName}` : "",
//         },
//         {
//           label: "Day Production",
//           value: production ? formatCount(production.dayProduction) : "—",
//           hint: "Total for today",
//         },
//       ],

//       infoTiles: [
//         {
//           icon: Timer,
//           label: "Cycle Time",
//           value: production ? formatCycleTime(production.cycleTimeSec) : "—",
//           weight: 1.1,
//         },
//         {
//           icon: Hash,
//           label: "Mould No.",
//           value: production ? textOrDash(production.moldNo) : "—",
//           weight: 1,
//         },
//         {
//           icon: Clock3,
//           label: "Last Update",
//           value: lastUpdate ? lastUpdate.time : "—",
//           sub: lastUpdate
//             ? [lastUpdate.day, ago].filter(Boolean).join(" · ")
//             : "",
//           weight: 1.2,
//         },
//       ],
//     };
//   };
// }

// /* ============================================================
//    VIEW: Injection Moulding TV screen
//    ============================================================ */

// export default function MouldingTvView() {
//   // TV is ALWAYS live data (refreshed every 15 sec by the view model).
//   const { machines } = useImmViewModel();

//   const { now, ready, timeText, dateText } = useTvClock();

//   const slides = IMM_MACHINES;
//   const total = slides.length;

//   const { index, multiple } = useTvRotation({
//     total,
//     durationMs: SLIDE_DURATION_MS,
//   });

//   const statusOf = (config) =>
//     ready
//       ? getMachineStatus(machines?.[config.key], now, MACHINE_TIMEOUT_MS)
//       : "loading";

//   const current = slides[index];
//   const next = slides[(index + 1) % total];
//   const theme = THEMES[statusOf(current)] ?? THEMES.loading;

//   const runningCount = slides.filter(
//     (config) => statusOf(config) === "running"
//   ).length;

//   // Glow follows the worst status when rotating, the machine's own otherwise
//   const glowTheme = multiple
//     ? THEMES[getGroupStatus(slides.map(statusOf))] ?? THEMES.loading
//     : theme;

//   return (
//     <TvShell glowTheme={glowTheme}>
//       <TvHeader
//         subtitle="Injection Moulding Monitoring"
//         runningCount={runningCount}
//         total={total}
//         timeText={timeText}
//         dateText={dateText}
//       />

//       {/* Machine (re-mounts on change = fade-in) */}
//       <TvSlide key={current.key}>
//         <MachinePanel
//           title={current.title}
//           machine={machines?.[current.key]}
//           now={now}
//           ready={ready}
//           timeoutMs={MACHINE_TIMEOUT_MS}
//           describe={makeDescribeMouldingMachine(current)}
//         />
//       </TvSlide>

//       <TvFooter
//         theme={theme}
//         index={index}
//         items={slides.map((config) => ({
//           key: config.key,
//           label: config.title,
//           theme: THEMES[statusOf(config)] ?? THEMES.loading,
//         }))}
//         nextLabel={next.title}
//         durationMs={SLIDE_DURATION_MS}
//         multiple={multiple}
//       />
//     </TvShell>
//   );
// }


















"use client";

import {
  IMM_MACHINES,
  useImmViewModel,
} from "@/features/moulding/view-models/use-imm-view-model";
import { Clock3, Hash, Timer } from "lucide-react";

import { TvShell, TvSlide } from "@/features/tv/components/tv-shell";
import { TvHeader } from "@/features/tv/components/tv-header";
import { TvFooter } from "@/features/tv/components/tv-footer";
import { MachinePanel } from "@/features/tv/components/machine-panel";
import { useTvClock } from "@/features/tv/hooks/use-tv-clock";
import { useTvRotation } from "@/features/tv/hooks/use-tv-rotation";
import { THEMES } from "@/features/tv/tv.theme";
import {
  formatCount,
  formatCycleTime,
  getMachineStatus,
  textOrDash,
} from "@/features/tv/tv.helpers";

/* ============================================================
   TV SETTINGS  (Moulding)
   ============================================================ */

// With more than one machine, each stays on screen this long.
// (With one machine there is no rotation.)
const SLIDE_DURATION_MS = 15 * 1000;

// No production event for this long = machine stopped.
const MACHINE_TIMEOUT_MS = 15 * 60 * 1000;

/* ============================================================
   WHAT EACH MACHINE PANEL SHOWS
   ============================================================ */

// Builds the "what to show" function for one machine (needs its config).
function makeDescribeMouldingMachine(config) {
  return function describeMouldingMachine({ production, ago, lastUpdate }) {
    // Small tags above the title: tonnage (if set) and current shift
    const badges = [];
    if (config.tonnage) badges.push(config.tonnage);
    if (production?.shiftName) badges.push(`SHIFT ${production.shiftName}`);

    return {
      badges,

      bigNumbers: [
        {
          label: "Shift Production",
          value: production ? formatCount(production.productionCount) : "—",
          hint: production?.shiftName ? `Shift ${production.shiftName}` : "",
        },
        {
          label: "Day Production",
          value: production ? formatCount(production.dayProduction) : "—",
          hint: "Total for today",
        },
      ],

      infoTiles: [
        {
          icon: Timer,
          label: "Cycle Time",
          value: production ? formatCycleTime(production.cycleTimeSec) : "—",
          weight: 1.1,
        },
        {
          icon: Hash,
          label: "Mould No.",
          value: production ? textOrDash(production.moldNo) : "—",
          weight: 1,
        },
        {
          icon: Clock3,
          label: "Last Update",
          value: lastUpdate ? lastUpdate.time : "—",
          sub: lastUpdate
            ? [lastUpdate.day, ago].filter(Boolean).join(" · ")
            : "",
          weight: 1.2,
        },
      ],
    };
  };
}

/* ============================================================
   VIEW: Injection Moulding TV screen
   ============================================================ */

export default function MouldingTvView() {
  // TV is ALWAYS live data (refreshed every 15 sec by the view model).
  const { machines } = useImmViewModel();

  const { now, ready, timeText, dateText } = useTvClock();

  const slides = IMM_MACHINES;
  const total = slides.length;

  const { index, multiple } = useTvRotation({
    total,
    durationMs: SLIDE_DURATION_MS,
  });

  const statusOf = (config) =>
    ready
      ? getMachineStatus(machines?.[config.key], now, MACHINE_TIMEOUT_MS)
      : "loading";

  const current = slides[index];
  const next = slides[(index + 1) % total];
  const theme = THEMES[statusOf(current)] ?? THEMES.loading;

  const runningCount = slides.filter(
    (config) => statusOf(config) === "running"
  ).length;

  return (
    // Background glow follows the machine on screen (same as the Assembly TV):
    // blue when it is running, red / amber only when THIS machine has a problem.
    <TvShell glowTheme={theme}>
      <TvHeader
        subtitle="Injection Moulding Monitoring"
        runningCount={runningCount}
        total={total}
        timeText={timeText}
        dateText={dateText}
      />

      {/* Machine (re-mounts on change = fade-in) */}
      <TvSlide key={current.key}>
        <MachinePanel
          title={current.title}
          machine={machines?.[current.key]}
          now={now}
          ready={ready}
          timeoutMs={MACHINE_TIMEOUT_MS}
          describe={makeDescribeMouldingMachine(current)}
        />
      </TvSlide>

      <TvFooter
        theme={theme}
        index={index}
        items={slides.map((config) => ({
          key: config.key,
          label: config.title,
          theme: THEMES[statusOf(config)] ?? THEMES.loading,
        }))}
        nextLabel={next.title}
        durationMs={SLIDE_DURATION_MS}
        multiple={multiple}
      />
    </TvShell>
  );
}