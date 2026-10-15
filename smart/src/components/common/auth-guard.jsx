"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { ROUTES } from "@/constants/routes";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
    </div>
  );
}

/*
 * Protects pages: only a logged-in user can see them.
 * Waits for the saved login to load first, so a refresh or a
 * re-opened tab never bounces a logged-in user to the login page.
 */
export function AuthGuard({ children }) {
  const router = useRouter();

  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace(ROUTES.LOGIN);
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated || !token) return <FullScreenLoader />;

  return children;
}

/*
 * Protects the login page: a logged-in user is sent straight to the
 * dashboard. The login form is only shown after pressing Logout.
 */
export function GuestGuard({ children }) {
  const router = useRouter();

  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && token) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated || token) return <FullScreenLoader />;

  return children;
}