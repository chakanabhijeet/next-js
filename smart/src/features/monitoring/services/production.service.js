

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







// import apiClient from "@/lib/axios/client";
// import { API_ENDPOINTS } from "@/config/api-endpoints";

// /*
//  * ONE endpoint for everything:  POST /proddata/yesterday
//  *
//  *   - no `date`  -> current (live) data
//  *   - with `date` ("YYYY-MM-DD") -> that day's production
//  *
//  * If you add PROD_DATA to API_ENDPOINTS.PRODUCTION it will be used,
//  * otherwise this path is used.
//  */
// const PROD_DATA_ENDPOINT =
//   API_ENDPOINTS?.PRODUCTION?.PROD_DATA ?? "/proddata/yesterday";

// async function postProdData(payload) {
//   // `undefined` fields (no date / no station / no variant) are dropped by
//   // JSON.stringify, so they are simply not sent.
//   const response = await apiClient.post(PROD_DATA_ENDPOINT, payload);

//   return response.data;
// }

// export const productionService = {
//   // Aero Deflector (device 02@xoom, no station)
//   getAssemblyShift: (date) =>
//     postProdData({
//       device_id: "02@xoom",
//       date,
//     }),

//   // W610 Rear Door Cladding RH (device 01@xoom)
//   getRHAssemblyShift: (date) =>
//     postProdData({
//       device_id: "01@xoom",
//       station: "RH",
//       date,
//     }),

//   // W610 Rear Door Cladding LH (device 01@xoom)
//   getLHAssemblyShift: (date) =>
//     postProdData({
//       device_id: "01@xoom",
//       station: "LH",
//       date,
//     }),

//   // W610 Rear Wheel Arch Cladding (device 03@xoom): RH / LH + HIGH / LOW
//   getVariantAssemblyShift: async ({ station, variant, date }) => {
//     const data = await postProdData({
//       device_id: "03@xoom",
//       station,
//       variant,
//       date,
//     });

//     // Make sure the card can always show the variant, even if the API
//     // does not echo it back.
//     return { ...data, variant: data?.variant ?? variant };
//   },
// };