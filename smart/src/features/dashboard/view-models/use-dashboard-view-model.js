"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";

export function useDashboardViewModel() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
  });

  return {
    data: query.data,

    isLoading: query.isLoading,

    isError: query.isError,

    error: query.error,

    refetch: query.refetch,
  };
}