/*
 * ====================================================================
 *  TV HELPERS  -  formatting + status logic shared by both TV screens
 * ====================================================================
 *
 *  Path: src/features/tv/tv.helpers.js
 */

// Allow small clock differences between server and browser.
export const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;

/* ---------------- Timestamps ---------------- */

export function parseTimestamp(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getMachineTimestamp(production) {
  return production?.productionTime || production?.createdAt || null;
}

// "17 Oct, 02:38:25 am" (used in the stopped message)
export function formatLastUpdate(production) {
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
export function formatLastUpdateParts(production) {
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

export function formatAgo(production, now) {
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

// Clock in the top bar
export function formatClockTime(now) {
  return new Date(now).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function formatClockDate(now) {
  return new Date(now).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ---------------- Status ---------------- */

/*
 * "loading" | "error" | "stopped" | "time-error" | "running"
 * timeoutMs = no production event for this long -> machine stopped.
 */
export function getMachineStatus(machine, now, timeoutMs) {
  const production = machine?.data;

  if (machine?.error || !production) {
    return machine?.error ? "error" : "loading";
  }

  const timestamp = parseTimestamp(getMachineTimestamp(production));
  if (!timestamp) return "stopped";

  const age = now - timestamp.getTime();
  if (age < -CLOCK_SKEW_TOLERANCE_MS) return "time-error";

  return age <= timeoutMs ? "running" : "stopped";
}

// One status for a whole slide: the most serious status among its machines.
export function getGroupStatus(statuses) {
  for (const bad of ["stopped", "error", "time-error"]) {
    if (statuses.includes(bad)) return bad;
  }
  if (statuses.includes("loading")) return "loading";
  return "running";
}

// The one-line message under the machine title.
export function getNotice(status, production, error, ago) {
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

/* ---------------- Numbers ---------------- */

// Actual value + offset, formatted (missing value counts as 0).
export function formatCount(value, offset = 0) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return "—";
  return (number + offset).toLocaleString("en-IN");
}

// "1 hr 2 min 3 sec"
export function formatDuration(seconds) {
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

// Two decimals: 68.333 -> "68.33 sec"
export function formatCycleTime(seconds) {
  if (seconds === null || seconds === undefined) return "—";

  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "—";

  return `${value.toFixed(2)} sec`;
}

export function textOrDash(value) {
  const text = value == null ? "" : String(value).trim();
  return text === "" ? "—" : text;
}

export function getVariantLabel(production) {
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