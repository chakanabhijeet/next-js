
// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { productionService } from "@/features/monitoring/services/production.service";
// import { normalizeProductionResponse } from "@/features/monitoring/models/production.model";

// export function useProductionViewModel() {
//   const [production, setProduction] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");

//   const refresh = useCallback(async () => {
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await productionService.getAssemblyShift();
//       const normalized = normalizeProductionResponse(response);

//       setProduction(normalized);
//     } catch (err) {
//       setError(
//         err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
//           "Failed to load production data."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     refresh();

//     const intervalId = setInterval(refresh, 15000);

//     return () => clearInterval(intervalId);
//   }, [refresh]);

//   return {
//     production,
//     isLoading,
//     error,
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
};

const INITIAL_MACHINES = {
  aeroDeflector: { data: null, error: null, loading: true },
  rh: { data: null, error: null, loading: true },
  lh: { data: null, error: null, loading: true },
};

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
              error:
                result.reason?.response?.data?.message ||
                result.reason?.message ||
                "Failed to load machine data",
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
