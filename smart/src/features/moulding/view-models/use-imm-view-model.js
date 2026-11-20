"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { immProductionService } from "@/features/moulding/services/imm-production.service";

import { normalizeImmResponse } from "@/features/moulding/models/imm-production.model";
import { normalizeImmLogResponse } from "@/features/moulding/models/imm-log.model";

import { IMM_MACHINES } from "@/features/moulding/config/imm-machines.config";

// Keep this export so existing components importing from this file continue working.
export { IMM_MACHINES } from "@/features/moulding/config/imm-machines.config";

const REFRESH_INTERVAL_MS = 15_000;

// Create initial state for every configured machine.
function createInitialMachineState() {
  return Object.fromEntries(
    IMM_MACHINES.map((machine) => [
      machine.key,
      {
        data: null,
        error: null,
        loading: true,

        logStats: null,
        logError: null,
        logLoading: true,
      },
    ])
  );
}

export function useImmViewModel() {
  const [machines, setMachines] = useState(createInitialMachineState);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const mountedRef = useRef(false);
  const requestRef = useRef(false);

  const refresh = useCallback(async () => {
    if (requestRef.current) return;

    requestRef.current = true;

    if (mountedRef.current) {
      setIsRefreshing(true);
    }

    try {
      await Promise.all(
        IMM_MACHINES.map(async (config) => {
          const payload = {
            deviceId: config.deviceId,
            machineId: config.machineId,
          };

          // Fetch both APIs independently for each machine.
          const [productionResult, logResult] =
            await Promise.allSettled([
              immProductionService.getShiftwise(payload),
              immProductionService.getLogStats(payload),
            ]);

          if (!mountedRef.current) return;

          setMachines((current) => {
            const previous = current[config.key] ?? {};

            const next = { ...previous };

            // Production metrics API.
            if (productionResult.status === "fulfilled") {
              next.data = normalizeImmResponse(
                productionResult.value
              );

              next.error = null;
            } else {
              next.error =
                productionResult.reason?.message ||
                String(productionResult.reason);
            }

            next.loading = false;

            // Last 10 shots API.
            if (logResult.status === "fulfilled") {
              next.logStats = normalizeImmLogResponse(
                logResult.value
              );

              next.logError = null;
            } else {
              next.logError =
                logResult.reason?.message ||
                String(logResult.reason);
            }

            next.logLoading = false;

            return {
              ...current,
              [config.key]: next,
            };
          });
        })
      );
    } finally {
      requestRef.current = false;

      if (mountedRef.current) {
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    refresh();

    const intervalId = setInterval(
      refresh,
      REFRESH_INTERVAL_MS
    );

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [refresh]);

  return {
    machines,
    isRefreshing,
    refresh,
  };
}
