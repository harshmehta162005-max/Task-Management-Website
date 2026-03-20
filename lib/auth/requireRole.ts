import { auth } from "@clerk/nextjs/server";

type Role = "ADMIN" | "MANAGER" | "MEMBER";

/**
 * Check if the current user has the required role.
 * Roles are stored in Clerk's publicMetadata.role field.
 * Returns the userId if authorized, throws if not.
 */
export async function requireRole(allowedRoles: Role[]) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Not authenticated");
  }

  const userRole = (sessionClaims?.metadata as { role?: Role })?.role || "MEMBER";

  if (!allowedRoles.includes(userRole)) {
    throw new Error(`Forbidden: Role '${userRole}' is not allowed. Required: ${allowedRoles.join(", ")}`);
  }

  return { userId, role: userRole };
}

/**
 * Check if the current user is at least authenticated.
 * A simpler guard that just ensures the user is logged in.
 */
export async function requireAuthenticated() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Not authenticated");
  }

  return userId;
}
