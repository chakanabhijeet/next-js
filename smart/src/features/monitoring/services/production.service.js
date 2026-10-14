



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

//   // New machine: RH Assembly
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

//   // New machine: LH Assembly
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

  // Existing machine: RH Assembly
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

  // Existing machine: LH Assembly
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

  // New device 03@xoom: RH / LH station with a HIGH / LOW variant
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
};