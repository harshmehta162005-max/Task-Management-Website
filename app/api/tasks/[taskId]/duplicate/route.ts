import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ taskId: string }> };

/**
 * POST /api/tasks/[taskId]/duplicate
 * Create a clone of the task with "(copy)" suffix.
 */
export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;

    const user = await getDbUser();

    const original = await db.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: { select: { userId: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!original) throw new ApiError(404, "Task not found");

    // Create the duplicate
    const duplicate = await db.task.create({
      data: {
        title: `${original.title} (copy)`,
        description: original.description,
        status: original.status,
        priority: original.priority,
        dueDate: original.dueDate,
        projectId: original.projectId,
        creatorId: user.id,
        // Clone assignees
        assignees: {
          create: original.assignees.map((a) => ({ userId: a.userId })),
        },
        // Clone tags
        tags: {
          create: original.tags.map((tt) => ({
            tag: {
              connectOrCreate: {
                where: { id: tt.tag.id },
                create: { name: tt.tag.name, color: tt.tag.color, workspaceId: tt.tag.workspaceId },
              },
            },
          })),
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        projectId: true,
      },
    });

    return Response.json(duplicate, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
