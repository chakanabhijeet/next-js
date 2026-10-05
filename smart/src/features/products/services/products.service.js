import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";
import { normalizeProducts } from "../models/product.model";

export const productsService = {
  getProducts: async () => {
    const response = await apiClient.get(
      API_ENDPOINTS.PRODUCTS.LIST
    );

    return normalizeProducts(response.data);
  },
};