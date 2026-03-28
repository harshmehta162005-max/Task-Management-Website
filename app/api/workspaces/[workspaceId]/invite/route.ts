import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { P_MEMBERS_INVITE } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId: slug } = await params;
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const ctx = await checkPermission(slug, P_MEMBERS_INVITE);

    const body = await req.json();
    const { email, role } = body;

    if (!email) throw new ApiError(400, "Email is required");

    // Check if user is already a member
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: ctx.workspace.id,
        user: { email },
      },
    });
    if (existingMember) throw new ApiError(400, "User is already a member of this workspace");

    // Check if pending invite exists
    const existingInvite = await db.workspaceInvite.findFirst({
      where: {
        workspaceId: ctx.workspace.id,
        email,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      // Just update the role and expiration
      const updated = await db.workspaceInvite.update({
        where: { id: existingInvite.id },
        data: {
          role: role || "MEMBER",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });
      return Response.json(updated);
    }

    const invite = await db.workspaceInvite.create({
      data: {
        email,
        workspaceId: ctx.workspace.id,
        inviterId: ctx.user.id,
        role: role || "MEMBER",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Activity log
    await db.activity.create({
      data: {
        action: `invited ${email}`,
        entityType: "WORKSPACE",
        entityId: ctx.workspace.id,
        actorId: ctx.user.id,
        workspaceId: ctx.workspace.id,
        metadata: { role: role || "MEMBER" },
      },
    });

    return Response.json(invite, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

