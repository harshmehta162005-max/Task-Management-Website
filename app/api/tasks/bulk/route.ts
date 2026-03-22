import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceSlug, taskIds, action, value } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      throw new ApiError(400, "taskIds must be a non-empty array");
    }

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    // Verify ownership of ALL tasks
    const tasks = await db.task.findMany({
      where: { id: { in: taskIds }, project: { workspaceId: workspace.id } },
      select: { id: true, creatorId: true },
    });

    if (tasks.length !== taskIds.length) {
      throw new ApiError(404, "One or more tasks not found");
    }

    const isOwner = tasks.every((t) => t.creatorId === user.id);
    if (!isOwner) {
      throw new ApiError(403, "Bulk actions are restricted to the task owner only");
    }

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
        // value is array of strings
        if (!Array.isArray(value)) throw new ApiError(400, "value must be an array of tag map objects");
        
        await db.$transaction(
          taskIds.map((taskId) =>
            db.task.update({
              where: { id: taskId },
              data: {
                tags: {
                  deleteMany: {},
                  create: value.map((tagObj: any) => ({
                    tag: {
                      connectOrCreate: {
                        where: { name_workspaceId: { name: tagObj.name, workspaceId: workspace.id } },
                        create: { name: tagObj.name, color: tagObj.color || "bg-primary/10", workspaceId: workspace.id },
                      },
                    },
                  })),
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
