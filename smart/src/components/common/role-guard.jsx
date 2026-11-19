"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { useAuthRole } from "@/features/auth/view-models/use-auth-role";
import { ROUTES } from "@/constants/routes";

/*
 * Only a super admin can see the children.
 * Everyone else sees a friendly "no access" message.
 * Use it INSIDE DashboardLayout (which already checks the login).
 */
export function SuperAdminGuard({ children }) {
  const { isSuperAdmin } = useAuthRole();

  if (isSuperAdmin) return children;

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Access restricted
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Only a Super Admin can add new people. Please contact your
          administrator if you need access.
        </p>

        <Link
          href={ROUTES.DASHBOARD}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}