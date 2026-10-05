"use client";

import { useQuery } from "@tanstack/react-query";

import { productsService } from "../services/products.service";

export function useProductsViewModel() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: productsService.getProducts,
  });

  return {
    products: query.data,

    isLoading: query.isLoading,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}