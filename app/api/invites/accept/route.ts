import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { getDbUser } from "@/lib/workspace/resolveWorkspace";

export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { token } = body;

    if (!token) {
      return Response.json({ error: "Invite token is required" }, { status: 400 });
    }

    const invite = await db.workspaceInvite.findUnique({
      where: { token },
      include: { workspace: true },
    });

    if (!invite) {
      return Response.json({ error: "Invalid invite token" }, { status: 404 });
    }

    if (invite.status !== "PENDING") {
      return Response.json({ error: "This invite is no longer valid or already accepted" }, { status: 400 });
    }

    if (new Date() > invite.expiresAt) {
      return Response.json({ error: "This invite has expired" }, { status: 400 });
    }

    // Assign Role logic
    // We try to find the Role in the workspace that matches invite.role
    const roleRecord = await db.role.findFirst({
      where: {
        workspaceId: invite.workspaceId,
        name: {
          equals: invite.role,
          mode: 'insensitive' // Just in case of casing issues
        }
      }
    });

    // Check if user is already a member
    let membership = await db.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId: invite.workspaceId,
        },
      },
    });

    if (!membership) {
      membership = await db.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: invite.workspaceId,
          roleId: roleRecord?.id || null, // Will fall back to default if null
        },
      });
    } else if (roleRecord) {
      // If they were somehow already a member, we might upgrade their role based on invite
      await db.workspaceMember.update({
        where: { id: membership.id },
        data: { roleId: roleRecord.id },
      });
    }

    // Mark invite as accepted
    await db.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });

    // Activity log
    await db.activity.create({
      data: {
        action: `accepted invitation as ${invite.role}`,
        entityType: "WORKSPACE",
        entityId: invite.workspaceId,
        actorId: user.id,
        workspaceId: invite.workspaceId,
      },
    });

    return Response.json(
      { success: true, workspaceSlug: invite.workspace.slug },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Accept invite error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
