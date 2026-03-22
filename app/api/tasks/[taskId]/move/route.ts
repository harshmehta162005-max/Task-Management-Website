import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ taskId: string }> };

/**
 * POST /api/tasks/[taskId]/move
 * Move a task to a different project.
 * Body: { projectId: string }
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;
    const body = await req.json();
    const { workspaceSlug, projectId } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!projectId) throw new ApiError(400, "projectId is required");

    // Verify user has access to workspace
    const { workspace } = await resolveWorkspace(workspaceSlug);

    // Verify task exists and belongs to the workspace
    const task = await db.task.findFirst({
      where: { id: taskId, project: { workspaceId: workspace.id } },
      select: { id: true, projectId: true },
    });
    if (!task) throw new ApiError(404, "Task not found in this workspace");

    // Verify target project exists and belongs to the workspace
    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id },
      select: { id: true, name: true },
    });
    if (!project) throw new ApiError(404, "Target project not found in this workspace");

    if (task.projectId === projectId) {
      throw new ApiError(400, "Task is already in this project");
    }

    // Move the task
    const updated = await db.task.update({
      where: { id: taskId },
      data: { projectId },
      select: { id: true, projectId: true },
    });

    return Response.json({
      id: updated.id,
      projectId: updated.projectId,
      projectName: project.name,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
