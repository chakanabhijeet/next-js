"use client";

import { useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";

import { IMM_MACHINES } from "@/features/moulding/config/imm-machines.config";
import {
  immKeys,
  immLogQuery,
  immProductionQuery,
} from "@/features/moulding/queries/imm.queries";

// Keep this export so existing components importing from this file continue working.
export { IMM_MACHINES } from "@/features/moulding/config/imm-machines.config";

/*
 * Turns the list of query results into the SAME shape the page already
 * uses, so no UI code needs to change:
 *
 *   machines[key] = {
 *     data, error, loading,            <- production API
 *     logStats, logError, logLoading,  <- last 10 shots API
 *   }
 *
 * Results arrive in the order we asked for them:
 *   [machine0 production, machine0 log, machine1 production, machine1 log, ...]
 */
function combineResults(results) {
  const machines = {};

  IMM_MACHINES.forEach((config, index) => {
    const production = results[index * 2];
    const log = results[index * 2 + 1];

    machines[config.key] = {
      // TanStack keeps the last good data when a later refresh fails,
      // so "Showing the last received data" still works.
      data: production.data ?? null,
      error: production.error
        ? production.error.message || String(production.error)
        : null,
      loading: production.isPending, // true until the first answer / error

      logStats: log.data ?? null,
      logError: log.error ? log.error.message || String(log.error) : null,
      logLoading: log.isPending,
    };
  });

  return {
    machines,
    isRefreshing: results.some((result) => result.isFetching),
  };
}

export function useImmViewModel() {
  const queryClient = useQueryClient();

  const { machines, isRefreshing } = useQueries({
    queries: IMM_MACHINES.flatMap((config) => [
      immProductionQuery(config),
      immLogQuery(config),
    ]),
    combine: combineResults,
  });

  // Refresh button: re-fetch every IMM query now.
  const refresh = useCallback(
    () => queryClient.refetchQueries({ queryKey: immKeys.all }),
    [queryClient]
  );

  return {
    machines,
    isRefreshing,
    refresh,
  };
}