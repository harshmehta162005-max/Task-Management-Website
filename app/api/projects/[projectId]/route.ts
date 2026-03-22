import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ projectId: string }> };

/**
 * GET /api/projects/[projectId]?workspaceSlug=xxx
 * Get a single project with members and tasks.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace } = await resolveWorkspace(slug);

    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, email: true, clerkId: true } },
          },
        },
        tasks: {
          where: { parentId: null },
          include: {
            assignees: {
              include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
              },
            },
            tags: {
              include: { tag: { select: { name: true, color: true } } },
            },
            _count: { select: { comments: true } },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return Response.json({
      id: project.id,
      name: project.name,
      description: project.description ?? "",
      members: project.members.map((m) => m.user.avatarUrl ?? ""),
      memberDetails: project.members.map((m) => ({
        id: m.user.id,
        name: m.user.name ?? m.user.email,
        avatarUrl: m.user.avatarUrl,
        role: m.role,
        clerkId: m.user.clerkId,
      })),
      tasks: project.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        creatorId: t.creatorId,
        assignees: t.assignees.map((a) => ({
          id: a.user.id,
          name: a.user.name ?? "",
          avatarUrl: a.user.avatarUrl ?? "",
        })),
        tags: t.tags.map((tt) => tt.tag.name),
        dueDate: t.dueDate?.toISOString().split("T")[0] ?? undefined,
        updatedAt: t.updatedAt.toISOString().split("T")[0],
        commentCount: t._count.comments,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/projects/[projectId]
 * Update project name/description/status.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const { name, description, status, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    const { workspace } = await resolveWorkspace(workspaceSlug);

    const existing = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
    });
    if (!existing) throw new ApiError(404, "Project not found in this workspace");

    const updated = await db.project.update({
      where: { id: projectId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status: status === "archived" ? "ARCHIVED" : "ACTIVE" }),
      },
      select: { id: true, name: true, description: true, status: true },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/projects/[projectId]
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");
    const { workspace } = await resolveWorkspace(slug);

    const existing = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
    });
    if (!existing) throw new ApiError(404, "Project not found in this workspace");

    await db.project.delete({ where: { id: projectId } });
    return Response.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
