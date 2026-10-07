import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  Plus,
  ShieldCheck,
} from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";

export default function PermissionsPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f4f8fd] p-4 pt-20 sm:p-6 lg:p-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">

          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <KeyRound className="h-7 w-7" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Permissions
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage user roles and permissions.
            </p>
          </div>

          {/* Assign Permission Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assign Permission
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Assign a role and permissions to a user.
                  </p>
                </div>
              </div>

              <Link
                href="/permissions/create"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="h-4 w-4" />

                Assign Permission

                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}