import axios from "axios";
import { BASE_URL } from "@/config/constants";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export const permissionService = {
  createPermission: async (permissionData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axios.post(
      `${BASE_URL}${API_ENDPOINTS.PERMISSIONS.CREATE}`,
      permissionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};