// export const API_ENDPOINTS = {
//   AUTH: {
//     LOGIN: "/users/loginuser",
//   },

//   DASHBOARD: {
//     SUMMARY: "/dashboard",
//   },

//   USERS: {
//     LIST: "/users",
//     DETAIL: (id) => `/users/${id}`,
//   },

//   PRODUCTS: {
//     LIST: "/products",
//     DETAIL: (id) => `/products/${id}`,
//   },

//    DEPARTMENTS: {
//     CREATE: "/dept/createdept",
//   },

//   PERMISSIONS: {
//     CREATE: "/permission/createpermission",
//   },
//   PRODUCTION: {
//   ASSEMBLY_SHIFT: "/proddata/assemblyshift",
// },

// };





export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/loginuser",
  },

  DASHBOARD: {
    SUMMARY: "/dashboard",
  },

  USERS: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
  },

  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
  },

  DEPARTMENTS: {
    CREATE: "/dept/createdept",
  },

  PERMISSIONS: {
    CREATE: "/permission/createpermission",
  },

  PRODUCTION: {
    // Assembly machines, live (today)
    ASSEMBLY_SHIFT: "/proddata/assemblyshift",

    // Assembly machines, past dates (same server as ASSEMBLY_SHIFT)
    PROD_DATA: "/proddata/yesterday",

    IMM_SHIFTWISE: "/proddata/immshiftwise",
  },
}