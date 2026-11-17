
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { immProductionService } from "@/features/moulding/services/imm-production.service";
import { normalizeImmResponse } from "@/features/moulding/models/imm-production.model";
import { normalizeImmLogResponse } from "@/features/moulding/models/imm-log.model";

export const IMM_MACHINES = [
  {
    key: "milacron2700",
    title: "2700 Ton Milacron",
    tonnage: "2700 T",
    deviceId: "05@xoom",
    machineId: "2700 Milacron",
  },
];

const REFRESH_INTERVAL_MS = 15_000;

export function useImmViewModel() {
  const [machines, setMachines] = useState(() =>
    Object.fromEntries(
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
    )
  );

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

          const [productionResult, logResult] =
            await Promise.allSettled([
              immProductionService.getShiftwise(payload),
              immProductionService.getLogStats(payload),
            ]);

          if (!mountedRef.current) return;

          setMachines((current) => {
            const previous = current[config.key] ?? {};
            const next = { ...previous };

            // Production metrics API
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

            // Last 10 shots API
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
