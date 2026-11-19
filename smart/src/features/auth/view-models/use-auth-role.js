"use client";

import { useAuthStore } from "../store/auth.store";
import { decodeJwtPayload } from "@/lib/jwt";
import { isSuperAdminRole } from "@/constants/roles";

// Reads the logged-in user's role (from the saved user, or the token).
// NOTE: this only controls what the screen shows. The backend must also
// check the role when a person is actually created.
export function useAuthRole() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const payload = decodeJwtPayload(token);

  const role = user?.user_role || user?.role || payload?.user_role || null;

  return {
    role,
    isSuperAdmin: isSuperAdminRole(role),
  };
}