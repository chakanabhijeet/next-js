"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES, TV_BRAND } from "@/features/tv/tv.theme";
import {
  formatAgo,
  formatLastUpdateParts,
  getMachineStatus,
  getNotice,
} from "@/features/tv/tv.helpers";

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

// A big number (Shift / Day production) with a colored top edge.
function BigNumberCard({ label, value, hint, theme, compact }) {
  return (
    <div
      className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border shadow-2xl shadow-black/40 ${
        TV_BRAND.card
      } ${theme.border} ${
        compact
          ? "rounded-[1.4vw] px-[1.2vw] pb-[1vh] pt-[1.5vh]"
          : "rounded-[1.8vw] px-[2vw] pb-[1.4vh] pt-[2vh]"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-[0.5vh] bg-gradient-to-r ${theme.edge}`}
      />

      <div className="flex shrink-0 items-center justify-between gap-[0.8vw]">
        <span
          className={`truncate font-semibold uppercase ${TV_BRAND.label} ${
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

      <FitNumber value={value} className={theme.number} />

      {/* Optional small line under the number (hint is undefined = none) */}
      {hint !== undefined && (
        <p
          className={`min-h-[1.6vw] shrink-0 truncate text-center text-[1.3vw] font-medium ${TV_BRAND.muted}`}
        >
          {hint || " "}
        </p>
      )}
    </div>
  );
}

// A small info box (Shift, Cycle Time, Last Update ...).
function InfoTile({ icon: Icon, label, value, sub, compact }) {
  return (
    <div
      className={`flex min-w-0 items-center overflow-hidden border border-blue-400/15 ${
        TV_BRAND.panel
      } ${
        compact
          ? "gap-[0.8vw] rounded-[1vw] px-[1vw] py-[0.9vh]"
          : "gap-[1.3vw] rounded-[1.4vw] px-[1.6vw] py-[1.3vh]"
      }`}
    >
      {!compact && (
        <div
          className={`flex h-[3.6vw] w-[3.6vw] shrink-0 items-center justify-center rounded-[1vw] ${TV_BRAND.iconBox}`}
        >
          <Icon className="h-[1.9vw] w-[1.9vw]" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-semibold uppercase ${TV_BRAND.label} ${
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
          className={`truncate font-medium leading-tight ${TV_BRAND.muted} ${
            compact ? "min-h-[1.2vw] text-[0.95vw]" : "min-h-[1.5vw] text-[1.15vw]"
          }`}
        >
          {sub || " "}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   MACHINE PANEL
   ============================================================ */

/*
  One machine: title + status badge, message strip, two big numbers,
  info row.

  compact = true  -> two machines share one slide (side by side)
  compact = false -> one machine fills the whole slide

  Props
    title, subtitle   text at the top
    machine           { data, error, loading } from the view model
    now, ready        from useTvClock()
    timeoutMs         no event for this long = machine stopped
    describe          a function that decides WHAT to show. It gets
                        { production, ago, lastUpdate, compact }
                      and returns
                        {
                          badges?:    ["SHIFT A", ...]   small tags above the title
                          bigNumbers: [{ label, value, hint? }, ...]
                          infoTiles:  [{ icon, label, value, sub?, weight? }, ...]
                        }
                      (weight = relative width of the tile)
*/
export function MachinePanel({
  title,
  subtitle,
  machine,
  now,
  ready,
  timeoutMs,
  compact = false,
  describe,
}) {
  const production = machine?.data ?? null;
  const error = machine?.error ?? null;
  const status = ready ? getMachineStatus(machine, now, timeoutMs) : "loading";
  const theme = THEMES[status] ?? THEMES.loading;
  const ago = ready && production ? formatAgo(production, now) : null;
  const lastUpdate = production ? formatLastUpdateParts(production) : null;
  const notice = getNotice(status, production, error, ago);

  const { badges, bigNumbers, infoTiles } = describe({
    production,
    ago,
    lastUpdate,
    compact,
  });

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col ${
        compact
          ? `gap-[1.2vh] rounded-[1.8vw] border p-[1.2vw] ${TV_BRAND.panel} ${theme.border}`
          : "gap-[1.6vh]"
      }`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-[1vw]">
        <div className="min-w-0">
          {/* Small tags above the title (row is kept even when empty) */}
          {badges && (
            <div className="flex min-h-[3.2vh] flex-wrap items-center gap-[1vw]">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className={`rounded-lg px-[0.9vw] py-[0.4vh] text-[1.2vw] font-bold tracking-[0.2em] ${TV_BRAND.tag}`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <h2
            className={`truncate font-extrabold leading-tight tracking-tight ${
              badges ? "mt-[0.6vh]" : ""
            } ${compact ? "text-[2.6vw]" : "text-[3.4vw]"}`}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className={`truncate font-semibold ${TV_BRAND.label} ${
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
        className={`shrink-0 truncate rounded-[1vw] border bg-slate-950/50 font-semibold ${
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
        {bigNumbers.map((item) => (
          <BigNumberCard
            key={item.label}
            label={item.label}
            value={item.value}
            hint={item.hint}
            theme={theme}
            compact={compact}
          />
        ))}
      </div>

      {/* Info row */}
      <div
        className={`grid shrink-0 ${compact ? "gap-[0.7vw]" : "gap-[1.3vw]"}`}
        style={{
          gridTemplateColumns: infoTiles
            .map((tile) => `${tile.weight ?? 1}fr`)
            .join(" "),
        }}
      >
        {infoTiles.map((tile) => (
          <InfoTile
            key={tile.label}
            icon={tile.icon}
            label={tile.label}
            value={tile.value}
            sub={tile.sub}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}