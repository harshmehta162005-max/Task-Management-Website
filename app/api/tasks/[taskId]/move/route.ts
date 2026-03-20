import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

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
    const { projectId } = body;

    if (!projectId) throw new ApiError(400, "projectId is required");

    // Verify user is authenticated
    await getDbUser();

    // Verify task exists
    const task = await db.task.findUnique({
      where: { id: taskId },
      select: { id: true, projectId: true },
    });
    if (!task) throw new ApiError(404, "Task not found");

    // Verify target project exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, name: true },
    });
    if (!project) throw new ApiError(404, "Target project not found");

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
