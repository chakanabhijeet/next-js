

// import apiClient from "@/lib/axios/client";
// import { API_ENDPOINTS } from "@/config/api-endpoints";

// export const productionService = {
//   // Existing machine: Aero Deflector
//   getAssemblyShift: async () => {
//     const response = await apiClient.post(
//       API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
//       {
//         tenant_id: "02",
//         device_id: "02@xoom",
//       }
//     );

//     return response.data;
//   },

//   // Existing machine: RH Assembly
//   getRHAssemblyShift: async () => {
//     const response = await apiClient.post(
//       API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
//       {
//         tenant_id: "TENANT-001",
//         device_id: "01@xoom",
//         station: "RH",
//       }
//     );

//     return response.data;
//   },

//   // Existing machine: LH Assembly
//   getLHAssemblyShift: async () => {
//     const response = await apiClient.post(
//       API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
//       {
//         tenant_id: "TENANT-001",
//         device_id: "01@xoom",
//         station: "LH",
//       }
//     );

//     return response.data;
//   },

//   // New device 03@xoom: RH / LH station with a HIGH / LOW variant
//   getVariantAssemblyShift: async ({ station, variant }) => {
//     const response = await apiClient.post(
//       API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
//       {
//         tenant_id: "02",
//         device_id: "03@xoom",
//         station,
//         variant,
//       }
//     );

//     return response.data;
//   },
// };



import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";

/*
 * TWO APIs:
 *
 *  1. LIVE (today)  -> existing ASSEMBLY_SHIFT endpoint  (getXxxShift methods)
 *  2. PAST DATES    -> new  POST /proddata/yesterday      (getProductionByDate)
 *
 * If the new API runs on a different host/port than apiClient's base URL,
 * put the FULL url in API_ENDPOINTS.PRODUCTION.PROD_DATA
 * (e.g. "http://192.168.7.113:8000/proddata/yesterday"); axios ignores the
 * base URL when the url is absolute.
 */
const PROD_DATA_ENDPOINT =
  API_ENDPOINTS?.PRODUCTION?.PROD_DATA ?? "/proddata/yesterday";

/* ------------------------------------------------------------------
   Which device / station / variant each machine uses on the NEW API.
   Keys match the keys used by the dashboard and the view model.
------------------------------------------------------------------ */
const HISTORY_TARGETS = {
  aeroDeflector: { device_id: "02@xoom" },
  rh: { device_id: "01@xoom", station: "RH" },
  lh: { device_id: "01@xoom", station: "LH" },
  rhHigh: { device_id: "03@xoom", station: "RH", variant: "HIGH" },
  rhLow: { device_id: "03@xoom", station: "RH", variant: "LOW" },
  lhHigh: { device_id: "03@xoom", station: "LH", variant: "HIGH" },
  lhLow: { device_id: "03@xoom", station: "LH", variant: "LOW" },
};

export const productionService = {
  /* ================= LIVE (today): existing assembly shift API ================= */

  // Aero Deflector
  getAssemblyShift: async () => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
      {
        tenant_id: "02",
        device_id: "02@xoom",
      }
    );

    return response.data;
  },

  // W610 Rear Door Cladding RH
  getRHAssemblyShift: async () => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
      {
        tenant_id: "TENANT-001",
        device_id: "01@xoom",
        station: "RH",
      }
    );

    return response.data;
  },

  // W610 Rear Door Cladding LH
  getLHAssemblyShift: async () => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
      {
        tenant_id: "TENANT-001",
        device_id: "01@xoom",
        station: "LH",
      }
    );

    return response.data;
  },

  // W610 Rear Wheel Arch Cladding: RH / LH station with a HIGH / LOW variant
  getVariantAssemblyShift: async ({ station, variant }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
      {
        tenant_id: "02",
        device_id: "03@xoom",
        station,
        variant,
      }
    );

    return response.data;
  },

  /* ================= PAST DATES: new proddata API ================= */

  // machineKey = "aeroDeflector" | "rh" | "lh" | "rhHigh" | "rhLow" | "lhHigh" | "lhLow"
  // date       = "YYYY-MM-DD"
  getProductionByDate: async (machineKey, date) => {
    const target = HISTORY_TARGETS[machineKey];

    if (!target) {
      throw new Error(`Unknown machine: ${machineKey}`);
    }

    // Payload: device_id, station (if any), variant (if any), date
    const response = await apiClient.post(PROD_DATA_ENDPOINT, {
      ...target,
      date,
    });

    const data = response.data;

    // Make sure variant cards can always show the variant.
    return { ...data, variant: data?.variant ?? target.variant ?? null };
  },

  // Whole-device total for a past date (NO station / variant filter).
  // Used to check that HIGH + LOW (RH + LH) add up to the device total.
  getDeviceTotalByDate: async (deviceId, date) => {
    const response = await apiClient.post(PROD_DATA_ENDPOINT, {
      device_id: deviceId,
      date,
    });

    return response.data;
  },
};