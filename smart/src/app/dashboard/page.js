// import DashboardLayout from "@/components/layout/dashboard-layout";

// export default function DashboardPage() {
//   return (
//     <DashboardLayout>
//       <div className="min-h-screen p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
//         <div className="mb-8">
//           <p className="text-sm font-semibold text-blue-600">
//             Smart Monitoring System
//           </p>

//           <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
//             Dashboard
//           </h1>

//           <p className="mt-2 text-base text-slate-500">
//             Welcome back. Here's what's happening today.
//           </p>
//         </div>

//         <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">
//               Total Employees
//             </p>

//             <p className="mt-3 text-3xl font-bold text-slate-900">
//               0
//             </p>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">
//               Active Monitoring
//             </p>

//             <p className="mt-3 text-3xl font-bold text-slate-900">
//               0
//             </p>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">
//               Reports
//             </p>

//             <p className="mt-3 text-3xl font-bold text-slate-900">
//               0
//             </p>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-sm font-medium text-slate-500">
//               System Status
//             </p>

//             <div className="mt-3 flex items-center gap-2">
//               <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

//               <span className="text-base font-semibold text-emerald-600">
//                 Online
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }





"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

const weeklyData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 72 },
  { day: "Fri", value: 64 },
  { day: "Sat", value: 38 },
  { day: "Sun", value: 52 },
];

const employeeData = [
  { name: "Active", value: 68 },
  { name: "Idle", value: 22 },
  { name: "Offline", value: 10 },
];

const recentActivities = [
  {
    employee: "Employee 001",
    activity: "Monitoring session started",
    time: "10:42 AM",
    status: "Active",
  },
  {
    employee: "Employee 002",
    activity: "Monitoring session completed",
    time: "10:18 AM",
    status: "Completed",
  },
  {
    employee: "Employee 003",
    activity: "Employee became idle",
    time: "09:56 AM",
    status: "Idle",
  },
  {
    employee: "Employee 004",
    activity: "Monitoring session started",
    time: "09:32 AM",
    status: "Active",
  },
  {
    employee: "Employee 005",
    activity: "Employee went offline",
    time: "09:10 AM",
    status: "Offline",
  },
];

export default function DashboardPage() {
  const maxValue = Math.max(...weeklyData.map((item) => item.value));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f8fd] p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Smart Monitoring System
          </p>

          <div className="mt-1 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>

              <p className="mt-2 text-base text-slate-500">
                Welcome back. Here's what's happening today.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-sm font-semibold text-emerald-700">
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Employees */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Employees
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  124
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  +8.2% this month
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Monitoring */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Monitoring
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  86
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  69.4% of employees
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Reports
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  32
                </p>

                <p className="mt-2 text-xs font-medium text-blue-600">
                  6 generated today
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  System Status
                </p>

                <p className="mt-3 text-2xl font-bold text-emerald-600">
                  Online
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  All services operational
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Activity Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Monitoring Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Weekly monitoring activity
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-600">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Activity
              </div>
            </div>

            {/* Chart */}
            <div className="mt-8">
              <div className="relative h-[260px]">
                {/* Horizontal grid */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[100, 75, 50, 25, 0].map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-3"
                    >
                      <span className="w-7 text-right text-[11px] text-slate-400">
                        {value}
                      </span>

                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute bottom-0 left-10 right-0 top-0 flex items-end justify-between gap-3 px-2 pb-7 pt-2">
                  {weeklyData.map((item) => {
                    const height = `${(item.value / maxValue) * 88}%`;

                    return (
                      <div
                        key={item.day}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                      >
                        <div className="group relative flex w-full max-w-[42px] flex-1 items-end">
                          <div
                            className="w-full rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400 transition-all duration-300 group-hover:from-blue-800 group-hover:to-blue-500"
                            style={{ height }}
                          >
                            <div className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white group-hover:block">
                              {item.value}
                            </div>
                          </div>
                        </div>

                        <span className="absolute bottom-0 text-[11px] font-medium text-slate-400">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Employee Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Employee Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current employee monitoring status
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              {/* Donut */}
              <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{
                  background:
                    "conic-gradient(#2563eb 0% 68%, #f59e0b 68% 90%, #cbd5e1 90% 100%)",
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-3xl font-bold text-slate-900">
                    124
                  </span>

                  <span className="text-xs text-slate-500">
                    Employees
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {employeeData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        index === 0
                          ? "bg-blue-600"
                          : index === 1
                            ? "bg-amber-500"
                            : "bg-slate-300"
                      }`}
                    />

                    <span className="text-sm font-medium text-slate-600">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Recent Activities */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Activities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Latest monitoring activities
                </p>
              </div>

              <button
                type="button"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => (
                <div
                  key={`${activity.employee}-${activity.time}`}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Activity className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {activity.employee}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {activity.activity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      {activity.time}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        activity.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : activity.status === "Completed"
                            ? "bg-blue-50 text-blue-600"
                            : activity.status === "Idle"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                System Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current system information
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    Server
                  </span>
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Activity className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    Monitoring
                  </span>
                </div>

                <span className="text-sm font-semibold text-blue-600">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium text-slate-600">
                    Alerts
                  </span>
                </div>

                <span className="text-sm font-semibold text-amber-600">
                  3
                </span>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-4 text-white">
                <p className="text-xs font-medium text-blue-100">
                  Monitoring Accuracy
                </p>

                <p className="mt-1 text-2xl font-bold">
                  96.8%
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Based on current monitoring data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}