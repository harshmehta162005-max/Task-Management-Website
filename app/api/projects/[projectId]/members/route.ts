import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { createNotification, notifyProjectMembers } from "@/lib/notifications/createNotification";

type Params = { params: Promise<{ projectId: string }> };

/**
 * GET /api/projects/[projectId]/members?workspaceSlug=xxx
 * List all members of a project.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace } = await resolveWorkspace(slug);

    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
    });
    if (!project) throw new ApiError(404, "Project not found");

    const members = await db.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      orderBy: { joinedAt: "asc" },
    });

    return Response.json(
      members.map((m) => ({
        id: m.id,
        userId: m.user.id,
        name: m.user.name ?? "",
        email: m.user.email ?? "",
        avatar: m.user.avatarUrl ?? "",
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/projects/[projectId]/members
 * Add a member to a project.
 * Body: { workspaceSlug, userId, role? }
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const { workspaceSlug, userId, role = "MEMBER" } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!userId) throw new ApiError(400, "userId is required");

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
      select: { id: true, name: true },
    });
    if (!project) throw new ApiError(404, "Project not found");

    // Check if already a member
    const existing = await db.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (existing) throw new ApiError(409, "User is already a member");

    const member = await db.projectMember.create({
      data: { userId, projectId, role },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });

    // PROJECT_MEMBER_ADDED: notify the added user
    await createNotification({
      type: "PROJECT_MEMBER_ADDED",
      category: "personal",
      title: `You were added to "${project.name}"`,
      body: `${user.name ?? "Someone"} added you to the project`,
      userId,
      actorId: user.id,
      workspaceId: workspace.id,
      linkUrl: `/${workspaceSlug}/projects/${projectId}`,
    });

    // Notify other project members
    await notifyProjectMembers(projectId, user.id, {
      type: "PROJECT_MEMBER_ADDED",
      category: "project",
      title: `${member.user.name ?? "A new member"} joined "${project.name}"`,
      body: `${user.name ?? "Someone"} added ${member.user.name ?? "a user"} to the project`,
      actorId: user.id,
      workspaceId: workspace.id,
      linkUrl: `/${workspaceSlug}/projects/${projectId}`,
    });

    return Response.json(
      { id: member.id, userId: member.userId, role: member.role, name: member.user.name },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/projects/[projectId]/members?workspaceSlug=xxx&userId=xxx
 * Remove a member from a project.
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    const targetUserId = req.nextUrl.searchParams.get("userId");

    if (!slug) throw new ApiError(400, "workspaceSlug is required");
    if (!targetUserId) throw new ApiError(400, "userId is required");

    const { workspace, user } = await resolveWorkspace(slug);

    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
      select: { id: true, name: true },
    });
    if (!project) throw new ApiError(404, "Project not found");

    const membership = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: targetUserId, projectId } },
    });
    if (!membership) throw new ApiError(404, "Member not found");

    await db.projectMember.delete({
      where: { userId_projectId: { userId: targetUserId, projectId } },
    });

    // PROJECT_MEMBER_REMOVED: notify the removed user
    if (targetUserId !== user.id) {
      await createNotification({
        type: "PROJECT_MEMBER_REMOVED",
        category: "personal",
        title: `You were removed from "${project.name}"`,
        body: `${user.name ?? "Someone"} removed you from the project`,
        userId: targetUserId,
        actorId: user.id,
        workspaceId: workspace.id,
      });
    }

    return Response.json({ removed: true });
  } catch (error) {
    return handleApiError(error);
  }
}
