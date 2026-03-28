import { db } from "@/lib/db/prisma";
import { ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * ─── checkProjectMember ──────────────────────────────────────────────────────
 *
 * Validates that a user is a member of a specific project.
 * This is the **scope check** — even if a user has `task.edit` permission,
 * they can only edit tasks in projects they belong to.
 *
 * Usage:
 *   await checkProjectMember(user.id, projectId);
 *
 * Throws 403 if user is not a member of the project.
 * Workspace owners are NOT auto-exempted here — call this only when needed
 * (the caller should skip this for owners).
 */
export async function checkProjectMember(
  userId: string,
  projectId: string
): Promise<void> {
  const membership = await db.projectMember.findUnique({
    where: {
      userId_projectId: { userId, projectId },
    },
    select: { id: true },
  });

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this project"
    );
  }
}

/**
 * Get the projectId for a given task. Throws 404 if task not found.
 */
export async function getTaskProjectId(taskId: string): Promise<string> {
  const task = await db.task.findUnique({
    where: { id: taskId },
    select: { projectId: true },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task.projectId;
}
