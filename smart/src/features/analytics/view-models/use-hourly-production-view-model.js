"use client";

import { hourlyProductionMock } from "@/features/analytics/models/hourly-production.model";

function buildSummary({ hours, targetPerHour }) {
  const total = hours.reduce((sum, item) => sum + item.production, 0);
  const targetTotal = targetPerHour * hours.length;

  const best = hours.reduce((a, b) => (b.production > a.production ? b : a));
  const lowest = hours.reduce((a, b) => (b.production < a.production ? b : a));

  return {
    total,
    targetTotal,
    achievement: targetTotal > 0 ? (total / targetTotal) * 100 : 0,
    average: hours.length > 0 ? total / hours.length : 0,
    best,
    lowest,
  };
}

export function useHourlyProductionViewModel() {
  // Static data for now. Replace with the service/API call later.
  const machines = hourlyProductionMock.map((data) => ({
    data,
    summary: buildSummary(data),
  }));

  return { machines };
}