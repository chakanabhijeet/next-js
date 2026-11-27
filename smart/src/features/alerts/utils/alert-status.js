/*
 * Path: src/features/alerts/utils/alert-status.js
 *
 * Plain helper functions (no React).
 *   getAlertState(machine, now)  ->  what is this machine doing?
 *   formatStoppedFor(ms)         ->  "24 min 12 sec"
 */

import {
  CLOCK_SKEW_TOLERANCE_MS,
  CRITICAL_AFTER_MS,
  STOPPED_AFTER_MS,
} from "../config/alerts.config";

export function parseTimestamp(timestamp) {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getMachineTimestamp(production) {
  return production?.productionTime || production?.createdAt || null;
}

/*
 * Returns one of:
 *   "running"   data is fresh
 *   "warning"   no data for more than STOPPED_AFTER_MS
 *   "critical"  no data for more than CRITICAL_AFTER_MS
 *   "no-data"   API error / nothing readable (can't tell)
 *   "loading"   still loading, or only saved / dummy data on screen
 *   "time-error" the API time is in the future
 *
 * It also returns the last update time and how long it has been.
 */
export function getAlertState(machine, now) {
  const production = machine?.data;

  // Dummy or saved data is not live, so it can never raise an alert
  if (production && (machine?.isPlaceholder || machine?.fromCache)) {
    if (!machine?.error) return { state: "loading" };
  }

  if (machine?.error) return { state: "no-data" };
  if (!production) return { state: "loading" };

  const lastUpdate = parseTimestamp(getMachineTimestamp(production));

  // Data exists but has no time at all: treat as stopped, duration unknown
  if (!lastUpdate) {
    return { state: "warning", lastUpdate: null, stoppedForMs: null };
  }

  const age = now - lastUpdate.getTime();

  if (age < -CLOCK_SKEW_TOLERANCE_MS) return { state: "time-error" };
  if (age <= STOPPED_AFTER_MS) return { state: "running", lastUpdate };

  return {
    state: age >= CRITICAL_AFTER_MS ? "critical" : "warning",
    lastUpdate,
    stoppedForMs: age,
  };
}

export function formatStoppedFor(ms) {
  if (ms === null || ms === undefined) return "Unknown";

  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (days > 0) return `${days} d ${hours} hr ${minutes} min`;
  if (hours > 0) return `${hours} hr ${minutes} min ${seconds} sec`;

  return `${minutes} min ${seconds} sec`;
}

/* "12 sec ago", "3 min 05 sec ago", "2 hr 10 min ago" */
export function formatAgo(date, now) {
  if (!date) return "No time received";

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

export function formatLastUpdate(date) {
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