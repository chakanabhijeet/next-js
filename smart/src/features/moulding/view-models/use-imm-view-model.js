"use client";

import { useCallback, useEffect, useState } from "react";
import { immProductionService } from "@/features/moulding/services/imm-production.service";
import { normalizeImmResponse } from "@/features/moulding/models/imm-production.model";

/*
 * INJECTION MOULDING MACHINES
 * To add another machine later, add one more object here
 * (key must be unique). The overview page shows one card per entry.
 */
export const IMM_MACHINES = [
  {
    key: "milacron2700",
    title: "2700 Ton Milacron",
    tonnage: "2700 T",
    deviceId: "05@xoom",
    machineId: "2700 Milacron",
  },
];

// How often the data is refreshed.
const REFRESH_INTERVAL_MS = 15 * 1000;

const INITIAL_MACHINES = Object.fromEntries(
  IMM_MACHINES.map((machine) => [
    machine.key,
    { data: null, error: null, loading: true },
  ])
);

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

export function useImmViewModel() {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const results = await Promise.allSettled(
        IMM_MACHINES.map((machine) => immProductionService.getShiftwise(machine))
      );

      setMachines((previous) => {
        const updated = { ...previous };

        results.forEach((result, index) => {
          const key = IMM_MACHINES[index].key;

          if (result.status === "fulfilled") {
            updated[key] = {
              data: normalizeImmResponse(result.value),
              error: null,
              loading: false,
            };
          } else {
            updated[key] = {
              ...previous[key],
              error: getErrorMessage(result.reason),
              loading: false,
            };
          }
        });

        return updated;
      });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [refresh]);

  return { machines, isRefreshing, refresh };
}