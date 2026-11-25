import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  getMachineConfig,
  buildMachinePayload,
} from "@/features/monitoring/config/machines.config";

/*
 * TWO APIs:
 *
 *  1. LIVE (today)  -> existing ASSEMBLY_SHIFT endpoint  (getLiveProduction)
 *  2. PAST DATES    -> new  POST /proddata/yesterday      (getProductionByDate)
 *
 * Which device / station / variant each machine uses now lives in
 *   features/monitoring/config/machines.config.js
 * so this file does not change when a machine is added.
 *
 * If the new API runs on a different host/port than apiClient's base URL,
 * put the FULL url in API_ENDPOINTS.PRODUCTION.PROD_DATA
 * (e.g. "http://192.168.7.113:8000/proddata/yesterday"); axios ignores the
 * base URL when the url is absolute.
 */
const PROD_DATA_ENDPOINT =
  API_ENDPOINTS?.PRODUCTION?.PROD_DATA ?? "/proddata/yesterday";

function requireMachine(machineKey) {
  const machine = getMachineConfig(machineKey);

  if (!machine) {
    throw new Error(`Unknown machine: ${machineKey}`);
  }

  return machine;
}

export const productionService = {
  /* ================= LIVE (today): existing assembly shift API ================= */

  // machineKey = any key from machines.config.js
  getLiveProduction: async (machineKey) => {
    const machine = requireMachine(machineKey);

    // Payload: tenant_id, device_id, station (if any), variant (if any)
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.ASSEMBLY_SHIFT,
      {
        tenant_id: machine.device.tenantId,
        ...buildMachinePayload(machine),
      }
    );

    return response.data;
  },

  /* ================= PAST DATES: new proddata API ================= */

  // machineKey = any key from machines.config.js
  // date       = "YYYY-MM-DD"
  getProductionByDate: async (machineKey, date) => {
    const machine = requireMachine(machineKey);

    // Payload: device_id, station (if any), variant (if any), date
    const response = await apiClient.post(PROD_DATA_ENDPOINT, {
      ...buildMachinePayload(machine),
      date,
    });

    const data = response.data;

    // Make sure variant cards can always show the variant.
    return { ...data, variant: data?.variant ?? machine.variant ?? null };
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