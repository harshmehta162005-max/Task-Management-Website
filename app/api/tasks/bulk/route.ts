import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { P_TASK_EDIT, P_TASK_DELETE, P_TASK_ASSIGN, PermissionKey } from "@/lib/rbac/permissions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceSlug, taskIds, action, value } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      throw new ApiError(400, "taskIds must be a non-empty array");
    }

    let requiredPerm: PermissionKey = P_TASK_EDIT;
    if (action === "DELETE") requiredPerm = P_TASK_DELETE;
    else if (action === "ASSIGN") requiredPerm = P_TASK_ASSIGN;

    const ctx = await checkPermission(workspaceSlug, requiredPerm);

    // Verify ownership of ALL tasks
    const tasks = await db.task.findMany({
      where: { id: { in: taskIds }, project: { workspaceId: ctx.workspace.id } },
      select: { id: true, creatorId: true },
    });

    if (tasks.length !== taskIds.length) {
      throw new ApiError(404, "One or more tasks not found in this workspace");
    }

    if (!ctx.isOwner) {
      const isCreator = tasks.every((t) => t.creatorId === ctx.user.id);
      if (!isCreator) {
        throw new ApiError(403, "Bulk actions are restricted to the task creator only");
      }
    }
    const workspace = ctx.workspace;

    switch (action) {
      case "COMPLETE":
        await db.task.updateMany({
          where: { id: { in: taskIds } },
          data: { status: "DONE" },
        });
        break;

      case "SET_DATE":
        await db.task.updateMany({
          where: { id: { in: taskIds } },
          data: { dueDate: value ? new Date(value) : null },
        });
        break;

      case "ASSIGN":
        // value is array of user IDs
        if (!Array.isArray(value)) throw new ApiError(400, "value must be an array of user IDs");
        
        // Since Prisma updateMany doesn't support nested relation creates easily, we must loop
        await db.$transaction(
          taskIds.map((taskId) =>
            db.task.update({
              where: { id: taskId },
              data: {
                assignees: {
                  deleteMany: {},
                  create: value.map((id: string) => ({ userId: id })),
                },
              },
            })
          )
        );
        break;

      case "TAG":
        // value is array of tag IDs
        if (!Array.isArray(value)) throw new ApiError(400, "value must be an array of tag IDs");
        
        // Validate tag IDs belong to workspace
        const validTags = await db.tag.findMany({
          where: { id: { in: value }, workspaceId: workspace.id },
          select: { id: true },
        });
        const validTagIds = new Set(validTags.map((t: { id: string }) => t.id));
        const filteredTagIds = value.filter((id: string) => validTagIds.has(id));

        await db.$transaction(
          taskIds.map((taskId) =>
            db.task.update({
              where: { id: taskId },
              data: {
                tags: {
                  deleteMany: {},
                  create: filteredTagIds.map((tagId: string) => ({ tagId })),
                },
              },
            })
          )
        );
        break;

      case "DELETE":
        await db.task.deleteMany({
          where: { id: { in: taskIds } },
        });
        break;

      default:
        throw new ApiError(400, "Invalid bulk action");
    }

    return Response.json({ success: true, count: taskIds.length });
  } catch (error) {
    return handleApiError(error);
  }
}
