import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { normalizeDashboardData } from "../models/dashboard.model";

export const dashboardService = {
  getDashboard: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.DASHBOARD.SUMMARY
    );

    return normalizeDashboardData(response.data);
  },
};