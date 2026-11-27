"use client";

import { Wifi, WifiOff } from "lucide-react";
import { TV_BRAND } from "@/features/tv/tv.theme";

/*
 * Top bar: logo + title on the left, running count + clock on the right.
 */
export function TvHeader({
  subtitle,
  runningCount,
  total,
  timeText,
  dateText,
}) {
  return (
    <header className="relative z-10 shrink-0 px-[3vw] pt-[2vh]">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-[1.2vw]">
          <img
            src="/logo.png"
            alt="APIPL logo"
            className="h-[3.8vw] w-auto max-w-[9vw] shrink-0 rounded-[1vw] bg-white object-contain p-[0.4vw] shadow-lg shadow-blue-950/60"
          />

          <div className="min-w-0">
            <p className="text-[2vw] font-extrabold leading-none tracking-wide">
              APIPL
            </p>
            <p
              className={`mt-[0.4vh] truncate text-[1.1vw] font-medium ${TV_BRAND.label}`}
            >
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[2vw]">
          <div
            className={`flex items-center gap-[0.8vw] whitespace-nowrap rounded-full border border-blue-400/20 px-[1.4vw] py-[0.9vh] text-[1.4vw] font-semibold ${TV_BRAND.panel}`}
          >
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
            <p
              className={`mt-[0.4vh] min-h-[1.4vw] text-[1.1vw] font-medium ${TV_BRAND.label}`}
            >
              {dateText}
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-[1.6vh] h-px w-full ${TV_BRAND.divider}`} />
    </header>
  );
}