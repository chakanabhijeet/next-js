

// import apiClient from "@/lib/axios/client";
// import { API_ENDPOINTS } from "@/config/api-endpoints";

// export const productionService = {
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
// };






import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export const productionService = {
  // Existing machine: Aero Deflector
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

  // New machine: RH Assembly
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

  // New machine: LH Assembly
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
};
