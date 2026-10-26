import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";

/*
 * Injection moulding machines:  POST /proddata/immshiftwise
 *
 * Best: add  IMM_SHIFTWISE: "http://192.168.0.170:8000/proddata/immshiftwise"
 * to API_ENDPOINTS.PRODUCTION. Until then the full URL below is used (axios
 * ignores the base URL when the url is absolute).
 */
const IMM_SHIFTWISE_URL =
  API_ENDPOINTS?.PRODUCTION?.IMM_SHIFTWISE ??
  "http://192.168.0.170:8000/proddata/immshiftwise";

export const immProductionService = {
  // Payload: { device_id: "05@xoom", machine_id: "2700 Milacron" }
  getShiftwise: async ({ deviceId, machineId }) => {
    const response = await apiClient.post(IMM_SHIFTWISE_URL, {
      device_id: deviceId,
      machine_id: machineId,
    });

    return response.data;
  },
};