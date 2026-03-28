// Cache bust 3: Recompile API with PrismaV5
import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { checkProjectMember } from "@/lib/rbac/checkProjectMember";
import { P_TASK_EDIT, P_TASK_DELETE } from "@/lib/rbac/permissions";
import { createNotification, notifyTaskAssignees, notifyProjectMembers } from "@/lib/notifications/createNotification";
import { runAutomations } from "@/lib/automations/engine";
import fs from "fs";

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

    const slug = _req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");
    const { workspace } = await resolveWorkspace(slug);

    const task = await db.task.findFirst({
      where: { id: taskId, project: { workspaceId: workspace.id } },
      include: {
        project: { select: { id: true, name: true } },
        creator: { select: { clerkId: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        tags: { include: { tag: { select: { id: true, name: true, color: true } } } },
        comments: {
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: "desc" },
        },
        subtasks: {
          select: { id: true, title: true, status: true, priority: true },
          orderBy: { position: "asc" },
        },
        userDependencies: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
        attachments: {
          select: { id: true, name: true, size: true },
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
      projectId: task.projectId,
      creatorId: task.creatorId,
      isCreator: currentDbUserId === task.creatorId,
      dueDate: task.dueDate?.toISOString() ?? null,
      assignees: task.assignees.map((a) => ({
        id: a.user.id,
        name: a.user.name ?? "",
        avatar: a.user.avatarUrl ?? "",
      })),
      tags: task.tags.map((tt) => ({ id: tt.tag.id, name: tt.tag.name, color: tt.tag.color })),
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
        blockedBy: task.userDependencies.filter((d: any) => d.isBlocking === false).map((d: any) => ({ id: d.user.id, name: d.user.name ?? "", avatar: d.user.avatarUrl })),
        blocking: task.userDependencies.filter((d: any) => d.isBlocking === true).map((d: any) => ({ id: d.user.id, name: d.user.name ?? "", avatar: d.user.avatarUrl })),
      },
      attachments: task.attachments.map((a: any) => ({
        id: a.id,
        name: a.name,
        size: a.size,
      })),
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
    const { title, description, status, priority, dueDate, tagIds, assigneeIds, subtasks, dependencies, attachments, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    const ctx = await checkPermission(workspaceSlug, P_TASK_EDIT);

    const existingTask = await db.task.findFirst({
      where: { id: taskId, project: { workspaceId: ctx.workspace.id } },
      select: {
        projectId: true,
        creatorId: true,
        title: true,
        status: true,
        dueDate: true,
        project: { select: { workspaceId: true, name: true } },
      },
    });
    if (!existingTask) throw new ApiError(404, "Task not found in this workspace");

    if (!ctx.isOwner) {
      await checkProjectMember(ctx.user.id, existingTask.projectId);
    }
    const { workspace, user } = ctx;

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
      },
      select: { id: true, title: true, status: true, priority: true, dueDate: true, updatedAt: true },
    });

    // Handle tags by ID — tags must already exist in workspace
    if (tagIds !== undefined && Array.isArray(tagIds)) {
      const workspaceId = existingTask.project.workspaceId;

      // Remove existing tag associations
      await db.taskTag.deleteMany({ where: { taskId } });

      // Validate and associate tags by ID
      if (tagIds.length > 0) {
        const validTags = await db.tag.findMany({
          where: { id: { in: tagIds }, workspaceId },
          select: { id: true },
        });
        const validIds = new Set(validTags.map((t: { id: string }) => t.id));
        for (const tagId of tagIds) {
          if (validIds.has(tagId)) {
            await db.taskTag.create({
              data: { taskId, tagId },
            });
          }
        }
      }
    }

    if (attachments !== undefined && Array.isArray(attachments)) {
      const existingAtt = await db.attachment.findMany({ where: { taskId } });
      const incomingIds = attachments.map((a: any) => a.id);
      
      const toDelete = existingAtt.filter(e => !incomingIds.includes(e.id)).map(e => e.id);
      if (toDelete.length > 0) {
        await db.attachment.deleteMany({ where: { id: { in: toDelete } } });
      }

      for (const a of attachments) {
        const exists = existingAtt.find(e => e.id === a.id);
        if (!exists) {
          await db.attachment.create({
            data: { id: a.id, name: a.name, size: a.size, taskId }
          });
        }
      }
    }

    // Handle user dependencies separately to avoid nested write conflicts
    if (dependencies !== undefined) {
      // Clear existing user dependencies for this task
      await db.taskUserDependency.deleteMany({ where: { taskId } });
      
      // blockedBy: users that block this task
      if (dependencies.blockedBy?.length > 0) {
        for (const u of dependencies.blockedBy) {
          await db.taskUserDependency.create({ data: { taskId, userId: u.id, isBlocking: false } });
        }
      }
      // blocking: users that are blocked by this task
      if (dependencies.blocking?.length > 0) {
        for (const u of dependencies.blocking) {
          await db.taskUserDependency.create({ data: { taskId, userId: u.id, isBlocking: true } });
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

    // ── Notifications ──
    const taskLink = `/${workspaceSlug}/projects?taskId=${taskId}`;

    // ASSIGNED: notify newly-added assignees
    if (assigneeIds !== undefined && Array.isArray(assigneeIds)) {
      for (const uid of assigneeIds as string[]) {
        if (uid === user.id) continue;
        await createNotification({
          type: "ASSIGNED",
          category: "personal",
          title: `You were assigned to "${existingTask.title}"`,
          body: `${user.name ?? "Someone"} assigned you to a task in ${existingTask.project.name}`,
          userId: uid,
          actorId: user.id,
          workspaceId: workspace.id,
          linkUrl: taskLink,
        });
      }
    }

    // DUE_SOON: notify assignees when deadline changes
    if (dueDate !== undefined) {
      const newDueTime = dueDate ? new Date(dueDate).getTime() : null;
      const oldDueTime = existingTask.dueDate ? existingTask.dueDate.getTime() : null;
      if (newDueTime !== oldDueTime) {
        const dateStr = dueDate ? new Date(dueDate).toLocaleDateString() : "No due date";
        await notifyTaskAssignees(taskId, user.id, {
          type: "DUE_SOON",
          category: "personal",
          title: `Deadline changed for "${existingTask.title}"`,
          body: `${user.name ?? "Someone"} changed the deadline to ${dateStr}`,
          actorId: user.id,
          workspaceId: workspace.id,
          linkUrl: taskLink,
        });
      }
    }

    // STATUS_CHANGE: notify assignees when status changes
    if (status !== undefined && status !== existingTask.status) {
      // Trigger user-defined Automations
      await runAutomations(
        "status_change", 
        { ...existingTask, status }, // pass new status 
        { ...existingTask.project, id: existingTask.projectId }, 
        workspace, 
        user.id
      ).catch(e => console.error("Automation error:", e));

      await notifyTaskAssignees(taskId, user.id, {
        type: "STATUS_CHANGE",
        category: "personal",
        title: `"${existingTask.title}" moved to ${status}`,
        body: `${user.name ?? "Someone"} changed the status from ${existingTask.status} to ${status}`,
        actorId: user.id,
        workspaceId: workspace.id,
        linkUrl: taskLink,
      });
    }

    // TASK_COMPLETED: notify project members when task is completed
    if (body.status === "DONE" && existingTask.status !== "DONE") {
      await notifyProjectMembers(existingTask.projectId, user.id, {
        type: "TASK_COMPLETED",
        category: "project",
        title: `"${existingTask.title}" was completed`,
        body: `${user.name ?? "Someone"} completed a task in ${existingTask.project.name}`,
        actorId: user.id,
        workspaceId: workspace.id,
        linkUrl: taskLink,
      });

      await db.activity.create({
        data: {
          action: `completed task "${existingTask.title}"`,
          entityType: "TASK",
          entityId: taskId,
          metadata: { projectId: existingTask.projectId, projectName: existingTask.project.name },
          actorId: user.id,
          workspaceId: workspace.id,
        },
      });
    }

    return Response.json(updated);
  } catch (error: any) {
    fs.writeFileSync("api-error.log", error.stack || error.toString());
    return handleApiError(error);
  }
}

/**
 * DELETE /api/tasks/[taskId]
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { taskId } = await params;
    const slug = _req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");
    const ctx = await checkPermission(slug, P_TASK_DELETE);

    const existing = await db.task.findFirst({
      where: { id: taskId, project: { workspaceId: ctx.workspace.id } },
    });
    if (!existing) throw new ApiError(404, "Task not found in this workspace");

    if (!ctx.isOwner) {
      await checkProjectMember(ctx.user.id, existing.projectId);
    }

    await db.task.delete({ where: { id: taskId } });
    return Response.json({ deleted: true });
  } catch (error: any) {
    fs.writeFileSync("api-error.log", error.stack || error.toString());
    return handleApiError(error);
  }
}
