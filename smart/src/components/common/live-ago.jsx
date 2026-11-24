"use client";

import { useSyncExternalStore } from "react";

/*
 * LIVE "x sec ago" TEXT
 * One shared 1-second timer for the whole page. Only the small "ago" texts
 * re-render every second, not the whole screen. The timer stops by itself
 * when nothing on the page needs it.
 */

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

// Current time in ms, updated every second
export function useLiveNow() {
  return useSyncExternalStore(
    subscribeToTick,
    getTickSnapshot,
    getTickSnapshot
  );
}

// Seconds are shown for the first hour, so the text visibly counts up
export function formatAgoFrom(timestamp, now) {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return null;

  const total = Math.max(0, Math.floor((now - date.getTime()) / 1000));

  if (total < 60) return `${total} sec ago`;

  const minutes = Math.floor(total / 60);

  if (minutes < 60) {
    return `${minutes} min ${String(total % 60).padStart(2, "0")} sec ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hr ${minutes % 60} min ago`;

  return `${Math.floor(hours / 24)} d ${hours % 24} hr ago`;
}

/*
 * <LiveAgo production={production} />            -> "12 sec ago"
 * <LiveAgo production={production} wrap />       -> " (12 sec ago)"
 * `production` needs productionTime or createdAt.
 */
export function LiveAgo({ production, className = "", wrap = false }) {
  const now = useLiveNow();

  const text = formatAgoFrom(
    production?.productionTime || production?.createdAt || null,
    now
  );

  if (!text) return null;

  return (
    <span className={`tabular-nums ${className}`}>
      {wrap ? ` (${text})` : text}
    </span>
  );
}