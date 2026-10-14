
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { productionService } from "@/features/monitoring/services/production.service";
// import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

// const MACHINE_REQUESTS = {
//   aeroDeflector: () => productionService.getAssemblyShift(),
//   rh: () => productionService.getRHAssemblyShift(),
//   lh: () => productionService.getLHAssemblyShift(),
// };

// const INITIAL_MACHINES = {
//   aeroDeflector: { data: null, error: null, loading: true },
//   rh: { data: null, error: null, loading: true },
//   lh: { data: null, error: null, loading: true },
// };

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
//               error:
//                 result.reason?.response?.data?.message ||
//                 result.reason?.message ||
//                 "Failed to load machine data",
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

import { useCallback, useEffect, useState } from "react";
import { productionService } from "@/features/monitoring/services/production.service";
import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

const MACHINE_REQUESTS = {
  aeroDeflector: () => productionService.getAssemblyShift(),
  rh: () => productionService.getRHAssemblyShift(),
  lh: () => productionService.getLHAssemblyShift(),

  // New device 03@xoom (change "HIGH" to "LOW" to show the other variant)
  rh03: () =>
    productionService.getVariantAssemblyShift({
      station: "RH",
      variant: "HIGH",
    }),
  lh03: () =>
    productionService.getVariantAssemblyShift({
      station: "LH",
      variant: "LOW",
    }),
};

const INITIAL_MACHINES = {
  aeroDeflector: { data: null, error: null, loading: true },
  rh: { data: null, error: null, loading: true },
  lh: { data: null, error: null, loading: true },
  rh03: { data: null, error: null, loading: true },
  lh03: { data: null, error: null, loading: true },
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