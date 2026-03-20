import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/tasks?workspaceSlug=xxx[&projectId=xxx][&assignee=me]
 * List tasks with filters.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const slug = sp.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace, user } = await resolveWorkspace(slug);
    const projectId = sp.get("projectId");
    const assigneeFilter = sp.get("assignee");

    // Build where clause
    const where: Record<string, unknown> = {
      project: { workspaceId: workspace.id },
    };
    if (projectId) where.projectId = projectId;
    if (assigneeFilter === "me") {
      where.assignees = { some: { userId: user.id } };
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignees: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        tags: {
          include: { tag: { select: { name: true, color: true } } },
        },
        _count: { select: { comments: true, subtasks: true } },
      },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });

    const result = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      projectName: t.project.name,
      projectId: t.project.id,
      assignees: t.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name ?? "",
        avatarUrl: a.user.avatarUrl ?? "",
      })),
      tags: t.tags.map((tt) => tt.tag.name),
      dueDate: t.dueDate?.toISOString() ?? null,
      dueLabel: t.dueDate ? formatDueLabel(t.dueDate) : "No due date",
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      commentCount: t._count.comments,
      subtaskCount: t._count.subtasks,
      isCompleted: t.status === "DONE",
    }));

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/tasks
 * Create a new task.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceSlug, projectId, title, description, priority, dueDate, assigneeIds, status } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!projectId) throw new ApiError(400, "projectId is required");
    if (!title) throw new ApiError(400, "Title is required");

    const { user, workspace } = await resolveWorkspace(workspaceSlug);

    // Get max position in project
    const maxPos = await db.task.aggregate({
      where: { projectId },
      _max: { position: true },
    });

    const task = await db.task.create({
      data: {
        title,
        description: description || null,
        status: status || "TODO",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        position: (maxPos._max.position ?? 0) + 1,
        projectId,
        creatorId: user.id,
        assignees: assigneeIds?.length
          ? { create: assigneeIds.map((userId: string) => ({ userId })) }
          : { create: { userId: user.id } },
      },
      include: {
        project: { select: { id: true, name: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        action: `created task "${task.title}"`,
        entityType: "TASK",
        entityId: task.id,
        metadata: { projectId, projectName: task.project.name },
        actorId: user.id,
        workspaceId: workspace.id,
      },
    });

    return Response.json(
      {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        projectName: task.project.name,
        projectId: task.project.id,
        dueDate: task.dueDate?.toISOString() ?? null,
        dueLabel: task.dueDate ? formatDueLabel(task.dueDate) : "No due date",
        isCompleted: task.status === "DONE",
        assignees: task.assignees.map((a) => ({
          id: a.user.id,
          name: a.user.name ?? "",
          avatarUrl: a.user.avatarUrl ?? "",
        })),
        tags: [],
        commentCount: 0,
      },
      { status: 201 }
    );
  } catch (error: any) {
    require("fs").writeFileSync("api-error.log", error.stack || error.toString());
    return handleApiError(error);
  }
}

function formatDueLabel(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days}d left`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
