/*
 * ====================================================================
 *  IMM QUERIES  -  everything TanStack Query needs to fetch IMM data
 * ====================================================================
 *
 *  Path: src/features/moulding/queries/imm.queries.js
 *
 *  Each machine has TWO queries:
 *    1. production  -> shift / day production, cycle time, mould no.
 *    2. log         -> last 10 shots + min / max / avg cycle time
 *
 *  TanStack Query now handles: polling, loading / error state,
 *  de-duplicating requests and keeping the last good data on errors.
 */

import { immProductionService } from "@/features/moulding/services/imm-production.service";
import { normalizeImmResponse } from "@/features/moulding/models/imm-production.model";
import { normalizeImmLogResponse } from "@/features/moulding/models/imm-log.model";

// How often live data is re-fetched.
export const REFRESH_INTERVAL_MS = 15_000;

/*
 * Query keys: one unique key per machine + API.
 * `immKeys.all` matches every IMM query (used by the Refresh button).
 */
export const immKeys = {
  all: ["imm"],
  production: (machine) => [
    "imm",
    "production",
    machine.deviceId,
    machine.machineId,
  ],
  log: (machine) => ["imm", "log", machine.deviceId, machine.machineId],
};

// Settings shared by both queries.
const POLLING_OPTIONS = {
  refetchInterval: REFRESH_INTERVAL_MS,
  // Keep polling even when the tab is in the background (wall displays).
  refetchIntervalInBackground: true,
  // One quick retry, then show the error (the old code never retried).
  retry: 1,
};

// Production metrics API (machine card numbers).
export function immProductionQuery(machine) {
  return {
    queryKey: immKeys.production(machine),
    queryFn: () =>
      immProductionService.getShiftwise({
        deviceId: machine.deviceId,
        machineId: machine.machineId,
      }),
    select: normalizeImmResponse, // raw API response -> clean object
    ...POLLING_OPTIONS,
  };
}

// Last 10 shots API (cycle time analysis).
export function immLogQuery(machine) {
  return {
    queryKey: immKeys.log(machine),
    queryFn: () =>
      immProductionService.getLogStats({
        deviceId: machine.deviceId,
        machineId: machine.machineId,
      }),
    select: normalizeImmLogResponse,
    ...POLLING_OPTIONS,
  };
}