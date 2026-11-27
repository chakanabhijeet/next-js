/*
 * ====================================================================
 *  ALERTS SETTINGS
 * ====================================================================
 *
 *  Path: src/features/alerts/config/alerts.config.js
 *
 *  Change a number here and the whole Alerts page follows.
 */

const MINUTE = 60 * 1000;

// A machine with no new data for longer than this is a "stopped" alert
export const STOPPED_AFTER_MS = 15 * MINUTE;

// A stopped machine becomes "critical" after this long
export const CRITICAL_AFTER_MS = 60 * MINUTE;

// Ignore timestamps that are slightly in the future (clock differences)
export const CLOCK_SKEW_TOLERANCE_MS = 60 * 1000;

// How often the "stopped for ..." counters tick on screen
export const ALERT_TICK_MS = 1000;

// How long a brand-new alert stays highlighted
export const NEW_ALERT_HIGHLIGHT_MS = 15 * 1000;

export const AREAS = {
  ASSEMBLY: "Assembly",
  MOULDING: "Moulding",
};