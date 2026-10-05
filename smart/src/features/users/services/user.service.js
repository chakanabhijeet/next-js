import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { normalizeUsers } from "../models/user.model";

export const usersService = {
  getUsers: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.USERS.LIST
    );

    return normalizeUsers(response.data);
  },
};