import axios from "axios";
import { base_url } from "@/config/api-config";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export const departmentService = {
  createDepartment: async (department) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axios.post(
      `${base_url}${API_ENDPOINTS.DEPARTMENTS.CREATE}`,
      {
        department,
      },
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