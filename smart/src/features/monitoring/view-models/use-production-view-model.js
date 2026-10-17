

"use client";

import { useCallback, useEffect, useState } from "react";
import { productionService } from "@/features/monitoring/services/production.service";
import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

const MACHINE_REQUESTS = {
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

export function useProductionViewModel() {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const entries = Object.entries(MACHINE_REQUESTS);

      const results = await Promise.allSettled(
        entries.map(([, request]) => request())
      );

      setMachines((previous) => {
        const updated = { ...previous };

        results.forEach((result, index) => {
          const key = entries[index][0];

          if (result.status === "fulfilled") {
            updated[key] = {
              data: normalizeProductionResponse(result.value),
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

    const intervalId = setInterval(() => {
      refresh();
    }, 30_000);

    return () => clearInterval(intervalId);
  }, [refresh]);

  return {
    machines,
    isLoading: Object.values(machines).some(
      (machine) => machine.loading
    ),
    isRefreshing,
    refresh,
  };
}






// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { productionService } from "@/features/monitoring/services/production.service";
// import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

// // Every request receives the selected date (undefined/null = live data).
// const MACHINE_REQUESTS = {
//   aeroDeflector: (date) => productionService.getAssemblyShift(date),
//   rh: (date) => productionService.getRHAssemblyShift(date),
//   lh: (date) => productionService.getLHAssemblyShift(date),

//   // Device 03@xoom: RH and LH, each with a HIGH and a LOW variant
//   rhHigh: (date) =>
//     productionService.getVariantAssemblyShift({
//       station: "RH",
//       variant: "HIGH",
//       date,
//     }),
//   rhLow: (date) =>
//     productionService.getVariantAssemblyShift({
//       station: "RH",
//       variant: "LOW",
//       date,
//     }),
//   lhHigh: (date) =>
//     productionService.getVariantAssemblyShift({
//       station: "LH",
//       variant: "HIGH",
//       date,
//     }),
//   lhLow: (date) =>
//     productionService.getVariantAssemblyShift({
//       station: "LH",
//       variant: "LOW",
//       date,
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

// /*
//  * useProductionViewModel()            -> live data, refreshed every 30 sec
//  * useProductionViewModel("2026-10-16") -> that day's data, loaded once
//  *                                         (no polling, results marked historical)
//  */
// export function useProductionViewModel(date = null) {
//   const [machines, setMachines] = useState(INITIAL_MACHINES);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Ignores answers that arrive after the date has already changed.
//   const requestIdRef = useRef(0);

//   const refresh = useCallback(async () => {
//     const requestId = ++requestIdRef.current;

//     setIsRefreshing(true);

//     try {
//       const entries = Object.entries(MACHINE_REQUESTS);

//       const results = await Promise.allSettled(
//         entries.map(([, request]) => request(date || undefined))
//       );

//       // A newer request (e.g. another date) has started: drop these results.
//       if (requestId !== requestIdRef.current) return;

//       setMachines((previous) => {
//         const updated = { ...previous };

//         results.forEach((result, index) => {
//           const key = entries[index][0];

//           if (result.status === "fulfilled") {
//             updated[key] = {
//               data: normalizeProductionResponse(result.value, {
//                 historical: Boolean(date),
//               }),
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
//       if (requestId === requestIdRef.current) {
//         setIsRefreshing(false);
//       }
//     }
//   }, [date]);

//   useEffect(() => {
//     // Date changed (or first load): show "Loading..." instead of old data.
//     setMachines(INITIAL_MACHINES);

//     refresh();

//     // Past dates never change, so only live data is polled.
//     if (date) return undefined;

//     const intervalId = setInterval(() => {
//       refresh();
//     }, 30_000);

//     return () => clearInterval(intervalId);
//   }, [refresh, date]);

//   return {
//     machines,
//     isLoading: Object.values(machines).some((machine) => machine.loading),
//     isRefreshing,
//     refresh,
//   };
// }