"use client";

import { useEffect, useState } from "react";
import { formatClockDate, formatClockTime } from "@/features/tv/tv.helpers";

const TICK_MS = 1000;

/*
 * Live clock + "x min ago" refresh for TV screens.
 *
 * `now` is null on the server and on the first client render, so both match
 * (prevents a hydration error). It is set to the real time after mount.
 */
export function useTvClock() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const ready = now !== null;

  return {
    now,
    ready,
    timeText: ready ? formatClockTime(now) : "--:--:--",
    dateText: ready ? formatClockDate(now) : " ",
  };
}