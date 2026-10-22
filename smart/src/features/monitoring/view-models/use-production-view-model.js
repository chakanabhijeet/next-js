

// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { productionService } from "@/features/monitoring/services/production.service";
// import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

// const MACHINE_REQUESTS = {
//   aeroDeflector: () => productionService.getAssemblyShift(),
//   rh: () => productionService.getRHAssemblyShift(),
//   lh: () => productionService.getLHAssemblyShift(),

//   // Device 03@xoom: RH and LH, each with a HIGH and a LOW variant
//   rhHigh: () =>
//     productionService.getVariantAssemblyShift({
//       station: "RH",
//       variant: "HIGH",
//     }),
//   rhLow: () =>
//     productionService.getVariantAssemblyShift({
//       station: "RH",
//       variant: "LOW",
//     }),
//   lhHigh: () =>
//     productionService.getVariantAssemblyShift({
//       station: "LH",
//       variant: "HIGH",
//     }),
//   lhLow: () =>
//     productionService.getVariantAssemblyShift({
//       station: "LH",
//       variant: "LOW",
//     }),
// };

// const INITIAL_MACHINES = {
//   aeroDeflector: { data: null, error: null, loading: true },
//   rh: { data: null, error: null, loading: true },
//   lh: { data: null, error: null, loading: true },
//   rhHigh: { data: null, error: null, loading: true },
//   rhLow: { data: null, error: null, loading: true },
//   lhHigh: { data: null, error: null, loading: true },
//   lhLow: { data: null, error: null, loading: true },
// };

// // Shows the backend's real error message instead of only "status code 400"
// function getErrorMessage(reason) {
//   const data = reason?.response?.data;

//   if (typeof data === "string" && data) return data;

//   return (
//     data?.message ||
//     data?.error ||
//     data?.detail ||
//     (data ? JSON.stringify(data) : null) ||
//     reason?.message ||
//     "Failed to load machine data"
//   );
// }

// export function useProductionViewModel() {
//   const [machines, setMachines] = useState(INITIAL_MACHINES);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const refresh = useCallback(async () => {
//     setIsRefreshing(true);

//     try {
//       const entries = Object.entries(MACHINE_REQUESTS);

//       const results = await Promise.allSettled(
//         entries.map(([, request]) => request())
//       );

//       setMachines((previous) => {
//         const updated = { ...previous };

//         results.forEach((result, index) => {
//           const key = entries[index][0];

//           if (result.status === "fulfilled") {
//             updated[key] = {
//               data: normalizeProductionResponse(result.value),
//               error: null,
//               loading: false,
//             };
//           } else {
//             updated[key] = {
//               ...previous[key],
//               error: getErrorMessage(result.reason),
//               loading: false,
//             };
//           }
//         });

//         return updated;
//       });
//     } finally {
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     refresh();

//     const intervalId = setInterval(() => {
//       refresh();
//     }, 30_000);

//     return () => clearInterval(intervalId);
//   }, [refresh]);

//   return {
//     machines,
//     isLoading: Object.values(machines).some(
//       (machine) => machine.loading
//     ),
//     isRefreshing,
//     refresh,
//   };
// }




"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { productionService } from "@/features/monitoring/services/production.service";
import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

/* LIVE (today): existing assembly shift API */
const LIVE_REQUESTS = {
  aeroDeflector: () => productionService.getAssemblyShift(),
  rh: () => productionService.getRHAssemblyShift(),
  lh: () => productionService.getLHAssemblyShift(),

  // Device 03@xoom: RH and LH, each with a HIGH and a LOW variant
  rhHigh: () =>
    productionService.getVariantAssemblyShift({
      station: "RH",
      variant: "HIGH",
    }),
  rhLow: () =>
    productionService.getVariantAssemblyShift({
      station: "RH",
      variant: "LOW",
    }),
  lhHigh: () =>
    productionService.getVariantAssemblyShift({
      station: "LH",
      variant: "HIGH",
    }),
  lhLow: () =>
    productionService.getVariantAssemblyShift({
      station: "LH",
      variant: "LOW",
    }),
};

/* PAST DATES: new proddata API (same machine keys) */
const HISTORY_REQUESTS = Object.fromEntries(
  Object.keys(LIVE_REQUESTS).map((key) => [
    key,
    (date) => productionService.getProductionByDate(key, date),
  ])
);

// Device that runs the Wheel Arch machines (RH/LH x HIGH/LOW).
const WHEEL_ARCH_DEVICE_ID = "03@xoom";

const INITIAL_MACHINES = {
  aeroDeflector: { data: null, error: null, loading: true },
  rh: { data: null, error: null, loading: true },
  lh: { data: null, error: null, loading: true },
  rhHigh: { data: null, error: null, loading: true },
  rhLow: { data: null, error: null, loading: true },
  lhHigh: { data: null, error: null, loading: true },
  lhLow: { data: null, error: null, loading: true },
};

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