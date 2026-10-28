// import apiClient from "@/lib/axios/client";
// import { API_ENDPOINTS } from "@/config/api-endpoints";

// /*
//  * Injection moulding machines:  POST /proddata/immshiftwise
//  *
//  * Best: add  IMM_SHIFTWISE: "http://192.168.0.170:8000/proddata/immshiftwise"
//  * to API_ENDPOINTS.PRODUCTION. Until then the full URL below is used (axios
//  * ignores the base URL when the url is absolute).
//  */
// const IMM_SHIFTWISE_URL =
//   API_ENDPOINTS?.PRODUCTION?.IMM_SHIFTWISE ??
//   "http://192.168.0.170:8000/proddata/immshiftwise";

// export const immProductionService = {
//   // Payload: { device_id: "05@xoom", machine_id: "2700 Milacron" }
//   getShiftwise: async ({ deviceId, machineId }) => {
//     const response = await apiClient.post(IMM_SHIFTWISE_URL, {
//       device_id: deviceId,
//       machine_id: machineId,
//     });

//     return response.data;
//   },
// };








import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";

function getBearerToken() {
  if (typeof window === "undefined") return null;

  const tokenKeys = [
    "accessToken",
    "access_token",
    "token",
    "authToken",
    "auth_token",
  ];

  for (const key of tokenKeys) {
    const token = window.localStorage.getItem(key);

    if (token && token !== "null" && token !== "undefined") {
      return token.replace(/^Bearer\s+/i, "").trim();
    }
  }

  // Support tokens stored inside JSON/Zustand localStorage entries.
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;

    const raw = window.localStorage.getItem(key);
    if (!raw || !raw.startsWith("{")) continue;

    try {
      const parsed = JSON.parse(raw);

      const candidates = [
        parsed?.accessToken,
        parsed?.access_token,
        parsed?.token,
        parsed?.state?.accessToken,
        parsed?.state?.access_token,
        parsed?.state?.token,
        parsed?.user?.accessToken,
        parsed?.user?.access_token,
      ];

      const token = candidates.find(
        (value) => typeof value === "string" && value.trim()
      );

      if (token) {
        return token.replace(/^Bearer\s+/i, "").trim();
      }
    } catch {
      // Ignore localStorage entries that are not valid JSON.
    }
  }

  return null;
}

function getAuthHeaders() {
  const token = getBearerToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please log in again."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const immProductionService = {
  getShiftwise: async ({ deviceId, machineId }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.IMM_SHIFTWISE,
      {
        device_id: deviceId,
        machine_id: machineId,
      }
    );

    return response.data;
  },

  getLogStats: async ({ deviceId, machineId }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.PRODUCTION.IMM_LOG,
      {
        device_id: deviceId,
        machine_id: machineId,
      },
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data;
  },
};
