// Role names that are allowed to register new people.
// These must match the `user_role` value your login API returns
// (inside the user object / token). Change them if yours differ.
export const SUPER_ADMIN_ROLES = ["superadmin", "super_admin"];

export function isSuperAdminRole(role) {
  if (typeof role !== "string") return false;

  return SUPER_ADMIN_ROLES.includes(role.trim().toLowerCase());
}