"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import HourlyProductionView from "@/features/analytics/views/hourly-production-view";
import { BarChart3 } from "lucide-react";

export default function MonitoringPage() {
  return (
    <DashboardLayout>
      <main className="min-h-screen min-w-0 bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto w-full max-w-[1800px] min-w-0">
          <header className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Monitoring</h1>
              <p className="text-sm text-slate-500">
                Hourly production by machine for the current shift
              </p>
            </div>
          </header>

          <HourlyProductionView />
        </div>
      </main>
    </DashboardLayout>
  );
}