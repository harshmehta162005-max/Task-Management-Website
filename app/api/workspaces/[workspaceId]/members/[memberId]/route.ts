import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { P_MEMBERS_ROLES, P_MEMBERS_REMOVE } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string; memberId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId, memberId } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role) throw new ApiError(400, "role is required");

    const ctx = await checkPermission(workspaceId, P_MEMBERS_ROLES);

    // Prevent modifying the owner
    const targetMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: ctx.workspace.id,
        userId: memberId,
      },
      include: { role: true }
    });
    if (!targetMember) throw new ApiError(404, "Member not found");
    if (targetMember.role?.name === "Owner") {
      throw new ApiError(403, "Cannot change the role of the workspace owner");
    }

    // Assign the new role (find the role ID)
    const newRole = await db.role.findFirst({
      where: { workspaceId: ctx.workspace.id, name: { equals: role, mode: "insensitive" } }
    });
    if (!newRole) throw new ApiError(400, "Invalid role name");

    const updated = await db.workspaceMember.update({
      where: { id: targetMember.id },
      data: { roleId: newRole.id },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId, memberId } = await params;

    const ctx = await checkPermission(workspaceId, P_MEMBERS_REMOVE);

    if (memberId === ctx.user.id) {
       if (ctx.isOwner) throw new ApiError(403, "Owner cannot leave workspace. Please delete it instead.");
    }

    const targetMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: ctx.workspace.id,
        userId: memberId,
      },
      include: { role: true }
    });
    if (!targetMember) throw new ApiError(404, "Member not found");
    if (targetMember.role?.name === "Owner") {
      throw new ApiError(403, "Cannot remove the workspace owner");
    }

    await db.workspaceMember.delete({ where: { id: targetMember.id } });

    return Response.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}

