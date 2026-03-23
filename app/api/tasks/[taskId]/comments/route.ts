import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ taskId: string }> };

/**
 * POST /api/tasks/[taskId]/comments
 * Add a comment to a task.
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;
    const body = await req.json();
    const { body: commentBody, workspaceSlug } = body;

    if (!commentBody?.trim()) throw new ApiError(400, "Comment body is required");
    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    const task = await db.task.findFirst({
      where: { id: taskId, project: { workspaceId: workspace.id } },
      select: { id: true, title: true, projectId: true, project: { select: { workspaceId: true } } },
    });
    if (!task) throw new ApiError(404, "Task not found in this workspace");

    const comment = await db.comment.create({
      data: {
        body: commentBody.trim(),
        taskId,
        authorId: user.id,
      },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        action: `commented on "${task.title}"`,
        entityType: "TASK",
        entityId: taskId,
        metadata: { projectId: task.projectId, comment: commentBody.trim().slice(0, 100) },
        actorId: user.id,
        workspaceId: task.project.workspaceId,
      },
    });

    return Response.json(
      {
        id: comment.id,
        body: comment.body,
        author: {
          id: comment.author.id,
          name: comment.author.name ?? "",
          avatar: comment.author.avatarUrl ?? "",
        },
        createdAt: comment.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/tasks/[taskId]/comments?commentId=xxx
 * Delete a comment.
 */
export async function DELETE(req: NextRequest) {
  try {
    const commentId = req.nextUrl.searchParams.get("commentId");
    const slug = req.nextUrl.searchParams.get("workspaceSlug");

    if (!commentId) throw new ApiError(400, "commentId is required");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace } = await resolveWorkspace(slug);

    const existing = await db.comment.findFirst({
      where: { id: commentId, task: { project: { workspaceId: workspace.id } } },
    });
    if (!existing) throw new ApiError(404, "Comment not found in this workspace");

    await db.comment.delete({ where: { id: commentId } });
    return Response.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
