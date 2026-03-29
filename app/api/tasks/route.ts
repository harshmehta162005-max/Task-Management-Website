// Cache bust 3: Recompile API with PrismaV5
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { checkProjectMember } from "@/lib/rbac/checkProjectMember";
import { P_TASK_CREATE } from "@/lib/rbac/permissions";
import { createNotification, notifyProjectMembers } from "@/lib/notifications/createNotification";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const myTasks = sp.get("myTasks");

    // Build where clause
    const where: any = {
      project: { workspaceId: workspace.id },
    };
    if (projectId) where.projectId = projectId;

    if (myTasks === "true") {
      // Fetch tasks where user is assignee OR creator (for owner approval flow)
      where.OR = [
        { assignees: { some: { userId: user.id } } },
        { creatorId: user.id },
      ];
    } else {
      // Force hide personal tasks everywhere EXCEPT My Tasks page
      where.project = {
        workspaceId: workspace.id,
        NOT: { name: "Personal Tasks", visibility: "PRIVATE" }
      };
      
      if (assigneeFilter === "me") {
        where.assignees = { some: { userId: user.id } };
      }
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
          include: { tag: { select: { id: true, name: true, color: true } } },
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
        workStatus: a.workStatus,
      })),
      tags: t.tags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name, color: tt.tag.color })),
      dueDate: t.dueDate?.toISOString() ?? null,
      dueLabel: t.dueDate ? formatDueLabel(t.dueDate) : "No due date",
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      commentCount: t._count.comments,
      subtaskCount: t._count.subtasks,
      isCompleted: t.status === "DONE",
      creatorId: t.creatorId,
      currentUserId: user.id,
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
    const { workspaceSlug, projectId, title, description, priority, dueDate, assigneeIds, status, tagIds, subtasks, attachments } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!title) throw new ApiError(400, "Title is required");

    const ctx = await checkPermission(workspaceSlug, P_TASK_CREATE);
    const { user, workspace } = ctx;

    let finalProjectId = projectId;
    let isPersonalTask = false;

    if (!finalProjectId || finalProjectId === "none") {
      isPersonalTask = true;
      let personalProject = await db.project.findFirst({
        where: { 
          workspaceId: workspace.id, 
          name: "Personal Tasks", 
          visibility: "PRIVATE",
          members: { some: { userId: user.id } }
        }
      });

      if (!personalProject) {
        personalProject = await db.project.create({
          data: {
            name: "Personal Tasks",
            description: "Automatically generated for personal tasks",
            visibility: "PRIVATE",
            workspaceId: workspace.id,
            members: { create: { userId: user.id, role: "OWNER" } }
          }
        });
      }
      finalProjectId = personalProject.id;
    }

    if (!ctx.isOwner) {
      await checkProjectMember(ctx.user.id, finalProjectId);
    }

    const project = await db.project.findFirst({
      where: { id: finalProjectId, workspaceId: workspace.id },
    });
    if (!project) throw new ApiError(404, "Project not found in this workspace");

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
        projectId: finalProjectId,
        creatorId: user.id,
        assignees: (assigneeIds?.length && !isPersonalTask)
          ? { create: assigneeIds.map((userId: string) => ({ userId })) }
          : { create: { userId: user.id } },
        ...(subtasks && subtasks.length > 0 && {
          subtasks: {
            create: subtasks.map((st: any) => ({
              title: st.text,
              status: st.done ? "DONE" : "TODO",
              priority: "MEDIUM",
              projectId: finalProjectId,
              creatorId: user.id,
            }))
          }
        }),
        ...(attachments && attachments.length > 0 && {
          attachments: {
            create: attachments.map((a: any) => ({
              id: a.id,
              name: a.name,
              size: a.size
            }))
          }
        })
      },
      include: {
        project: { select: { id: true, name: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });

    if (tagIds && tagIds.length > 0) {
      // Validate all tag IDs belong to this workspace
      const validTags = await db.tag.findMany({
        where: { id: { in: tagIds }, workspaceId: workspace.id },
        select: { id: true },
      });
      const validIds = new Set(validTags.map((t: { id: string }) => t.id));
      for (const tagId of tagIds) {
        if (validIds.has(tagId)) {
          await db.taskTag.create({
            data: { taskId: task.id, tagId },
          });
        }
      }
    }

    // Log activity
    if (!isPersonalTask) {
      await db.activity.create({
        data: {
          action: `created task "${task.title}"`,
          entityType: "TASK",
          entityId: task.id,
          metadata: { projectId: finalProjectId, projectName: task.project.name },
          actorId: user.id,
          workspaceId: workspace.id,
        },
      });

      // ── Notifications ──
      const taskLink = `/${workspaceSlug}/projects?taskId=${task.id}`;

      // ASSIGNED: notify assignees (except creator)
      for (const a of task.assignees) {
        if (a.user.id === user.id) continue;
        await createNotification({
          type: "ASSIGNED",
          category: "personal",
          title: `You were assigned to "${task.title}"`,
          body: `${user.name ?? "Someone"} assigned you to a task in ${task.project.name}`,
          userId: a.user.id,
          actorId: user.id,
          workspaceId: workspace.id,
          linkUrl: taskLink,
        });
      }

      // TASK_CREATED: notify project members
      await notifyProjectMembers(finalProjectId, user.id, {
        type: "TASK_CREATED",
        category: "project",
        title: `New task: "${task.title}"`,
        body: `${user.name ?? "Someone"} created a task in ${task.project.name}`,
        actorId: user.id,
        workspaceId: workspace.id,
        linkUrl: taskLink,
      });
    }

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
        tags: [] as { id: string; name: string; color: string }[],
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
