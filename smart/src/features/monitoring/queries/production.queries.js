/*
 * ====================================================================
 *  PRODUCTION QUERIES  -  everything TanStack Query needs to fetch data
 * ====================================================================
 *
 *  Path: src/features/monitoring/queries/production.queries.js
 *
 *  Three kinds of queries:
 *    1. LIVE          one per machine, today, refreshed every 30 sec
 *    2. HISTORY       one per machine for a chosen past date, loaded once
 *    3. DEVICE TOTAL  whole Wheel Arch device for a past date (used to
 *                     check that RH/LH x HIGH/LOW add up)
 *
 *  Which machines exist comes from machines.config.js, so this file
 *  does not change when a machine is added.
 */

import { productionService } from "@/features/monitoring/services/production.service";
import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";
import { DEVICES } from "@/features/monitoring/config/machines.config";

export const LIVE_REFRESH_INTERVAL_MS = 30_000;

// Past dates do not change, so they are kept for 10 minutes before a re-fetch.
const HISTORY_STALE_TIME_MS = 10 * 60 * 1000;

export const WHEEL_ARCH_DEVICE_ID = DEVICES.WHEEL_ARCH.id;

/*
 * Query keys. The "prefix" keys are used by the Refresh button to
 * re-fetch a whole group at once.
 */
export const productionKeys = {
  liveAll: ["production", "live"],
  live: (machineKey) => ["production", "live", machineKey],

  historyAll: (date) => ["production", "history", date],
  history: (machineKey, date) => ["production", "history", date, machineKey],
  deviceTotal: (deviceId, date) => [
    "production",
    "history",
    date,
    "device",
    deviceId,
  ],
};

/*
 * `select` functions turn the raw API response into the clean shape the
 * page uses. Defined once here so their identity is stable.
 */
const selectLive = (data) => normalizeProductionResponse(data);

const selectHistory = (data) =>
  normalizeProductionResponse(data, { historical: true });

const selectDayTotal = (data) =>
  normalizeProductionResponse(data, { historical: true }).dayProduction;

// One quick retry, then show the error (the old code never retried).
const RETRY = 1;

/* 1. LIVE (today) - existing assembly shift API */
export function liveProductionQuery(machineKey) {
  return {
    queryKey: productionKeys.live(machineKey),
    queryFn: () => productionService.getLiveProduction(machineKey),
    select: selectLive,

    refetchInterval: LIVE_REFRESH_INTERVAL_MS,
    // Keep polling when the tab is in the background (wall displays).
    refetchIntervalInBackground: true,
    retry: RETRY,

    // Drop live data as soon as we switch to a past date, so coming back to
    // "today" shows "Loading..." instead of old numbers.
    gcTime: 0,
  };
}

/* 2. HISTORY (past date) - proddata API */
export function historyProductionQuery(machineKey, date) {
  return {
    queryKey: productionKeys.history(machineKey, date),
    queryFn: () => productionService.getProductionByDate(machineKey, date),
    select: selectHistory,

    staleTime: HISTORY_STALE_TIME_MS,
    retry: RETRY,
  };
}

/* 3. DEVICE TOTAL (past date) - whole device, no station / variant */
export function deviceTotalQuery(deviceId, date) {
  return {
    queryKey: productionKeys.deviceTotal(deviceId, date),
    queryFn: () => productionService.getDeviceTotalByDate(deviceId, date),
    select: selectDayTotal,

    staleTime: HISTORY_STALE_TIME_MS,
    retry: RETRY,
  };
}