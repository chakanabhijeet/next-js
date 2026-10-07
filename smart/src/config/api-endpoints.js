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
};