"use client";

import { useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";

import { MACHINE_KEYS } from "@/features/monitoring/config/machines.config";
import {
  WHEEL_ARCH_DEVICE_ID,
  deviceTotalQuery,
  historyProductionQuery,
  liveProductionQuery,
  productionKeys,
} from "@/features/monitoring/queries/production.queries";

// Shows the backend's real error message instead of only "status code 400"
function getErrorMessage(reason) {
  const data = reason?.response?.data;

  if (typeof data === "string" && data) return data;

  return (
    data?.message ||
    data?.error ||
    data?.detail ||
    (data ? JSON.stringify(data) : null) ||
    reason?.message ||
    "Failed to load machine data"
  );
}

/*
 * useProductionViewModel()             -> LIVE: assembly shift API,
 *                                         refreshed every 30 sec
 * useProductionViewModel("2026-10-16") -> PAST: proddata API for that date,
 *                                         loaded once (no polling)
 *
 * Returns the same shape as before, so the page UI does not change:
 *   { machines, wheelArchTotal, isLoading, isRefreshing, refresh }
 *
 *   machines[key] = { data, error, loading }
 */
export function useProductionViewModel(date = null) {
  const queryClient = useQueryClient();
  const historical = Boolean(date);

  /*
   * Order of the queries:
   *   [machine 0, machine 1, ... machine N-1, (past dates only) device total]
   * A different date = different query keys, so the old date's cards never
   * flash after the date changes.
   */
  const queries = MACHINE_KEYS.map((key) =>
    historical ? historyProductionQuery(key, date) : liveProductionQuery(key)
  );

  if (historical) {
    queries.push(deviceTotalQuery(WHEEL_ARCH_DEVICE_ID, date));
  }

  // Turns the list of results into { machines, wheelArchTotal, ... }
  const combine = useCallback(
    (results) => {
      const machines = {};

      MACHINE_KEYS.forEach((key, index) => {
        const result = results[index];

        machines[key] = {
          // TanStack keeps the last good data when a refresh fails.
          data: result.data ?? null,
          error: result.error ? getErrorMessage(result.error) : null,
          loading: result.isPending, // true until the first answer / error
        };
      });

      // Past dates only: whole-device total (null = unknown / failed).
      const totalResult = historical ? results[MACHINE_KEYS.length] : null;

      return {
        machines,
        wheelArchTotal: totalResult?.data ?? null,
        isLoading: Object.values(machines).some((machine) => machine.loading),
        isRefreshing: results.some((result) => result.isFetching),
      };
    },
    [historical]
  );

  const { machines, wheelArchTotal, isLoading, isRefreshing } = useQueries({
    queries,
    combine,
  });

  // Refresh button: live -> all live queries, past -> that date's queries.
  const refresh = useCallback(
    () =>
      queryClient.refetchQueries({
        queryKey: historical
          ? productionKeys.historyAll(date)
          : productionKeys.liveAll,
      }),
    [queryClient, historical, date]
  );

  return {
    machines,
    wheelArchTotal,
    isLoading,
    isRefreshing,
    refresh,
  };
}