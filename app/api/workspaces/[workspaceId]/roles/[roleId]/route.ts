import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { P_SETTINGS_ROLES } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string; roleId: string }> };

/**
 * PATCH /api/workspaces/[workspaceId]/roles/[roleId]
 * Update a role's name, description, or permissions.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId: slug, roleId } = await params;
    if (!slug || !roleId) throw new ApiError(400, "Missing params");

    const ctx = await checkPermission(slug, P_SETTINGS_ROLES);

    const existing = await db.role.findFirst({
      where: { id: roleId, workspaceId: ctx.workspace.id },
    });
    if (!existing) throw new ApiError(404, "Role not found");

    const body = await req.json();
    const { name, description, permissions } = body;

    const updated = await db.role.update({
      where: { id: roleId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(permissions !== undefined && { permissions }),
      },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/workspaces/[workspaceId]/roles/[roleId]
 * Delete a custom role. System roles cannot be deleted.
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId: slug, roleId } = await params;
    if (!slug || !roleId) throw new ApiError(400, "Missing params");

    const ctx = await checkPermission(slug, P_SETTINGS_ROLES);

    const existing = await db.role.findFirst({
      where: { id: roleId, workspaceId: ctx.workspace.id },
    });
    if (!existing) throw new ApiError(404, "Role not found");
    if (existing.isSystem) throw new ApiError(400, "Cannot delete system roles");

    // Unassign members from this role before deleting
    await db.workspaceMember.updateMany({
      where: { roleId, workspaceId: ctx.workspace.id },
      data: { roleId: null },
    });

    await db.role.delete({ where: { id: roleId } });

    return Response.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
