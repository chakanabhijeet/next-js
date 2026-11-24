"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { productionService } from "@/features/monitoring/services/production.service";
import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";
import {
  DEVICES,
  MACHINE_KEYS,
} from "@/features/monitoring/config/machines.config";

/* LIVE (today): one request per machine in machines.config.js */
const LIVE_REQUESTS = Object.fromEntries(
  MACHINE_KEYS.map((key) => [key, () => productionService.getLiveProduction(key)])
);

/* PAST DATES: same machine keys, new proddata API */
const HISTORY_REQUESTS = Object.fromEntries(
  MACHINE_KEYS.map((key) => [
    key,
    (date) => productionService.getProductionByDate(key, date),
  ])
);

// Device whose whole-day total is compared with its station/variant cards
// on past dates (Wheel Arch: RH/LH x HIGH/LOW).
const WHEEL_ARCH_DEVICE_ID = DEVICES.WHEEL_ARCH.id;

// Every machine starts in the "loading" state.
const INITIAL_MACHINES = Object.fromEntries(
  MACHINE_KEYS.map((key) => [key, { data: null, error: null, loading: true }])
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

/*
 * useProductionViewModel()             -> LIVE: assembly shift API,
 *                                         refreshed every 30 sec
 * useProductionViewModel("2026-10-16") -> PAST: proddata API for that date,
 *                                         loaded once (no polling)
 */
export function useProductionViewModel(date = null) {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Past dates only: total of the whole Wheel Arch device (null = unknown).
  const [wheelArchTotal, setWheelArchTotal] = useState(null);

  // Which data set (live or a date) the stored machines belong to. Stops the
  // previous date's cards from flashing for one frame after the date changes.
  const dataKey = date || "live";
  const [loadedKey, setLoadedKey] = useState("live");

  // Ignores answers that arrive after the date has already changed.
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const historical = Boolean(date);

    setIsRefreshing(true);

    try {
      const requests = historical ? HISTORY_REQUESTS : LIVE_REQUESTS;
      const entries = Object.entries(requests);

      // Past dates: also ask for the whole-device total (no station/variant)
      // so the page can show if anything is not assigned to HIGH / LOW.
      const totalPromise = historical
        ? Promise.allSettled([
            productionService.getDeviceTotalByDate(WHEEL_ARCH_DEVICE_ID, date),
          ])
        : Promise.resolve(null);

      const results = await Promise.allSettled(
        entries.map(([, request]) => request(date))
      );

      const totalResult = await totalPromise;

      // A newer request (e.g. another date) has started: drop these results.
      if (requestId !== requestIdRef.current) return;

      if (totalResult?.[0]?.status === "fulfilled") {
        setWheelArchTotal(
          normalizeProductionResponse(totalResult[0].value, {
            historical: true,
          }).dayProduction
        );
      } else {
        setWheelArchTotal(null);
      }

      setMachines((previous) => {
        const updated = { ...previous };

        results.forEach((result, index) => {
          const key = entries[index][0];

          if (result.status === "fulfilled") {
            updated[key] = {
              data: normalizeProductionResponse(result.value, { historical }),
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
      if (requestId === requestIdRef.current) {
        setIsRefreshing(false);
      }
    }
  }, [date]);

  useEffect(() => {
    // Date changed (or first load): show "Loading..." instead of old data.
    setMachines(INITIAL_MACHINES);
    setWheelArchTotal(null);
    setLoadedKey(dataKey);

    refresh();

    // Past dates never change, so only live data is polled.
    if (date) return undefined;

    const intervalId = setInterval(() => {
      refresh();
    }, 30_000);

    return () => clearInterval(intervalId);
  }, [refresh, date, dataKey]);

  const visibleMachines = loadedKey === dataKey ? machines : INITIAL_MACHINES;

  return {
    machines: visibleMachines,
    wheelArchTotal: loadedKey === dataKey ? wheelArchTotal : null,
    isLoading: Object.values(visibleMachines).some((machine) => machine.loading),
    isRefreshing,
    refresh,
  };
}