import { db } from "@/lib/db/prisma";
import { resolveWorkspace, ApiError } from "@/lib/workspace/resolveWorkspace";
import type { PermissionKey } from "./permissions";

/**
 * The context returned after a successful permission check.
 * Mirrors the resolveWorkspace return but guarantees permission was validated.
 */
export type PermissionContext = {
  workspace: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    ownerId: string;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
  membership: Awaited<ReturnType<typeof resolveWorkspace>>["membership"];
  isOwner: boolean;
  permissions: string[];
};

/**
 * ─── checkPermission ─────────────────────────────────────────────────────────
 *
 * Core RBAC middleware. Validates that the current authenticated user
 * has the required permission for the given workspace.
 *
 * Usage:
 *   const ctx = await checkPermission(slug, "project.create");
 *
 * Flow:
 *   1. Resolve workspace + authenticate user via resolveWorkspace()
 *   2. If user is workspace **owner** → bypass, always allowed
 *   3. Read the user's role.permissions (JSON array of permission keys)
 *   4. If required permission is NOT in the array → throw 403
 *   5. Return full context for use in the route handler
 */
export async function checkPermission(
  slug: string,
  requiredPermission: PermissionKey
): Promise<PermissionContext> {
  const resolved = await resolveWorkspace(slug);
  const { workspace, user, membership, isOwner } = resolved;

  // Owner always bypasses permission checks
  if (isOwner) {
    return {
      workspace,
      user,
      membership,
      isOwner: true,
      permissions: [], // Owner has implicit full access
    };
  }

  // Get the user's role permissions from DB
  const rolePermissions = extractPermissions(membership);

  // Check if user has the required permission
  if (!rolePermissions.includes(requiredPermission)) {
    throw new ApiError(
      403,
      `Forbidden: you do not have the '${requiredPermission}' permission`
    );
  }

  return {
    workspace,
    user,
    membership,
    isOwner: false,
    permissions: rolePermissions,
  };
}

/**
 * ─── resolvePermissions ──────────────────────────────────────────────────────
 *
 * Same as checkPermission but does NOT require a specific permission.
 * Returns the user's full permissions array for the workspace.
 * Used by the GET /permissions endpoint.
 */
export async function resolvePermissions(slug: string): Promise<PermissionContext> {
  const resolved = await resolveWorkspace(slug);
  const { workspace, user, membership, isOwner } = resolved;

  if (isOwner) {
    const { ALL_PERMISSIONS } = await import("./permissions");
    return {
      workspace,
      user,
      membership,
      isOwner: true,
      permissions: [...ALL_PERMISSIONS],
    };
  }

  return {
    workspace,
    user,
    membership,
    isOwner: false,
    permissions: extractPermissions(membership),
  };
}

/**
 * Extract permission keys array from a workspace membership's role.
 * The Role.permissions field is a JSON column storing string[].
 */
function extractPermissions(
  membership: Awaited<ReturnType<typeof resolveWorkspace>>["membership"]
): string[] {
  // membership.role is included via resolveWorkspace (include: { role: true })
  const role = (membership as Record<string, unknown>).role as
    | { permissions: unknown }
    | null
    | undefined;

  if (!role || !role.permissions) return [];

  // permissions is stored as JSON — could be a string or already parsed
  const perms = role.permissions;
  if (Array.isArray(perms)) return perms as string[];
  if (typeof perms === "string") {
    try {
      const parsed = JSON.parse(perms);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}
