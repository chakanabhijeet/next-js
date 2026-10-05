import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { normalizeLoginResponse } from "../models/auth.model";

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    return normalizeLoginResponse(response.data);
  },
};