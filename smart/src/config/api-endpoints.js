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

    // Injection moulding (2700 ton machine). This API runs on a DIFFERENT
    // server, so the full address is used (axios ignores the base URL when
    // the address is complete).
    IMM_SHIFTWISE: "/proddata/immshiftwise",

    // Injection moulding shot log (last shots, min / max / avg cycle time).
    // Also a different server, so the full address is used.
    IMM_LOG: "http://192.168.7.100:8000/proddata/immlog",
  },
};
