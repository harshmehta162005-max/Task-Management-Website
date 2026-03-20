import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ taskId: string }> };

/**
 * GET /api/tasks/[taskId]
 */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;

    // Get the current authenticated user's DB id
    let currentDbUserId: string | null = null;
    try {
      const dbUser = await getDbUser();
      currentDbUserId = dbUser.id;
    } catch {
      // Not authenticated — treat as non-creator
    }

    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        project: { select: { id: true, name: true } },
        creator: { select: { clerkId: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        tags: { include: { tag: true } },
        comments: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: "desc" },
        },
        subtasks: {
          select: { id: true, title: true, status: true, priority: true },
          orderBy: { position: "asc" },
        },
        dependencies: {
          include: { dependsOn: { select: { id: true, title: true, status: true } } },
        },
        dependents: {
          include: { task: { select: { id: true, title: true, status: true } } },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!task) throw new ApiError(404, "Task not found");

    return Response.json({
      id: task.id,
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      creatorId: task.creatorId,
      isCreator: currentDbUserId === task.creatorId,
      dueDate: task.dueDate?.toISOString() ?? null,
      assignees: task.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name ?? "",
        avatar: a.user.avatarUrl ?? "",
      })),
      tags: task.tags.map((tt) => tt.tag.name),
      comments: task.comments.map((c) => ({
        id: c.id,
        body: c.body,
        author: { id: c.author.id, name: c.author.name ?? "", avatar: c.author.avatarUrl },
        createdAt: c.createdAt.toISOString(),
      })),
      subtasks: task.subtasks.map((s) => ({
        id: s.id,
        title: s.title,
        completed: s.status === "DONE",
      })),
      dependencies: {
        blockedBy: task.dependencies.map((d) => d.dependsOn),
        blocking: task.dependents.map((d) => d.task),
      },
      attachments: [],
      activity: [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/tasks/[taskId]
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;
    const body = await req.json();
    const { title, description, status, priority, dueDate, tags, assigneeIds, subtasks, dependencies } = body;

    const existingTask = await db.task.findUnique({
      where: { id: taskId },
      select: { projectId: true, creatorId: true },
    });
    if (!existingTask) throw new ApiError(404, "Task not found");

    const updated = await db.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeIds !== undefined && {
          assignees: {
            deleteMany: {},
            create: assigneeIds.map((id: string) => ({ userId: id })),
          },
        }),
        ...(tags !== undefined && {
          tags: {
            deleteMany: {},
            create: tags.map((name: string) => ({
              tag: { connectOrCreate: { where: { name }, create: { name, color: "slate" } } },
            })),
          },
        }),
      },
      select: { id: true, title: true, status: true, priority: true, dueDate: true, updatedAt: true },
    });

    // Handle dependencies separately to avoid nested write conflicts
    if (dependencies !== undefined) {
      // Clear existing and recreate
      await db.taskDependency.deleteMany({ where: { taskId } });
      await db.taskDependency.deleteMany({ where: { dependsOnId: taskId } });
      
      // blockedBy: this task depends on others
      if (dependencies.blockedBy?.length > 0) {
        for (const d of dependencies.blockedBy) {
          await db.taskDependency.create({ data: { taskId, dependsOnId: d.id } });
        }
      }
      // blocking: others depend on this task
      if (dependencies.blocking?.length > 0) {
        for (const d of dependencies.blocking) {
          await db.taskDependency.create({ data: { taskId: d.id, dependsOnId: taskId } });
        }
      }
    }

    if (subtasks !== undefined && Array.isArray(subtasks)) {
      const existingSubtasks = await db.task.findMany({ where: { parentId: taskId } });
      const incomingIds = subtasks.map((s: any) => s.id);
      
      const toDelete = existingSubtasks.filter(e => !incomingIds.includes(e.id)).map(e => e.id);
      if (toDelete.length > 0) {
        await db.task.deleteMany({ where: { id: { in: toDelete } } });
      }

      for (const s of subtasks) {
        const subStatus = s.completed ? "DONE" : "TODO";
        const exists = existingSubtasks.find(e => e.id === s.id);
        if (exists) {
          await db.task.update({ where: { id: s.id }, data: { title: s.title, status: subStatus } });
        } else {
          await db.task.create({
            data: {
              id: s.id,
              title: s.title,
              status: subStatus,
              projectId: existingTask.projectId,
              creatorId: existingTask.creatorId,
              parentId: taskId,
              priority: "MEDIUM"
            }
          });
        }
      }
    }

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/tasks/[taskId]
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;
    await db.task.delete({ where: { id: taskId } });
    return Response.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
