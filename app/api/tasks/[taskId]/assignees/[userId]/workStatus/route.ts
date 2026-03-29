import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { handleApiError, ApiError, resolveWorkspace } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { checkProjectMember } from "@/lib/rbac/checkProjectMember";
import { P_TASK_EDIT } from "@/lib/rbac/permissions";
import { createNotification, notifyTaskAssignees } from "@/lib/notifications/createNotification";
import { deriveTaskStatus } from "@/lib/tasks/deriveTaskStatus";
import { runAutomations } from "@/lib/automations/engine";

type Params = { params: Promise<{ taskId: string; userId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { taskId, userId } = await params;
    const body = await req.json();
    const { workStatus, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!["TODO", "IN_PROGRESS", "SUBMITTED"].includes(workStatus)) {
      throw new ApiError(400, "Invalid workStatus");
    }

    const ctx = await checkPermission(workspaceSlug, P_TASK_EDIT);
    const { workspace, user } = ctx;

    const task = await db.task.findFirst({
      where: { id: taskId, project: { workspaceId: workspace.id } },
      include: { 
        assignees: true,
        project: { select: { name: true, workspaceId: true } }
      },
    });

    if (!task) throw new ApiError(404, "Task not found");

    if (!ctx.isOwner) {
      await checkProjectMember(user.id, task.projectId);
    }

    // Permission check: you can only update your OWN workStatus, UNLESS you are the owner (rejecting)
    if (user.id !== userId && !ctx.isOwner) {
      throw new ApiError(403, "You can only update your own work status");
    }

    const assignee = task.assignees.find((a) => a.userId === userId);
    if (!assignee) throw new ApiError(404, "Assignee not found on this task");

    let startedAt = assignee.startedAt;
    let submittedAt = assignee.submittedAt;

    if (workStatus === "IN_PROGRESS" && assignee.workStatus !== "IN_PROGRESS") {
      startedAt = startedAt || new Date(); // first time start
    }
    if (workStatus === "SUBMITTED" && assignee.workStatus !== "SUBMITTED") {
      submittedAt = new Date();
    }

    // Update the specific assignee
    await db.taskAssignee.update({
      where: { id: assignee.id },
      data: { workStatus, startedAt, submittedAt },
    });

    // Re-fetch assignees for derivation
    const updatedAssignees = await db.taskAssignee.findMany({
      where: { taskId },
    });

    // Derive new overall task status
    const newTaskStatus = deriveTaskStatus(task.status, updatedAssignees);
    let updatedTask = task;

    if (newTaskStatus !== task.status) {
      updatedTask = await db.task.update({
        where: { id: taskId },
        data: { status: newTaskStatus },
        include: { assignees: true, project: { select: { name: true, workspaceId: true } } },
      }) as any;

      // Notifications on Task Status shift via Assignment Work Flow
      if (newTaskStatus === "IN_REVIEW") {
        await createNotification({
          type: "SYSTEM",
          category: "personal",
          title: `Ready for Review: "${task.title}"`,
          body: `All assignees have submitted their work for task in ${task.project.name}`,
          userId: task.creatorId,
          actorId: user.id,
          workspaceId: workspace.id,
          linkUrl: `/${workspaceSlug}/projects?taskId=${task.id}`,
        });
      }
      
      // Hook into existing automated engine (e.g. for status_change)
      await runAutomations(
        "status_change",
        { ...updatedTask, status: newTaskStatus },
        { ...updatedTask.project, id: updatedTask.projectId },
        workspace,
        user.id
      ).catch(e => console.error("Automation error:", e));
    }

    // Notifications for specific rejection path: If Owner rejects and sets an assignee back to IN_PROGRESS
    if (ctx.isOwner && workStatus === "IN_PROGRESS" && user.id !== userId) {
      await createNotification({
        type: "SYSTEM",
        category: "personal",
        title: `Work Rejected: "${task.title}"`,
        body: `${user.name ?? "The Owner"} has requested changes on your submission.`,
        userId: userId,
        actorId: user.id,
        workspaceId: workspace.id,
        linkUrl: `/${workspaceSlug}/projects?taskId=${task.id}`,
      });
    }

    // Optional notification: First Assignee Starts
    if (workStatus === "IN_PROGRESS" && task.status === "TODO" && newTaskStatus === "IN_PROGRESS") {
      await db.activity.create({
        data: {
          action: `started working on task "${task.title}"`,
          entityType: "TASK",
          entityId: taskId,
          metadata: { projectId: task.projectId, projectName: task.project.name },
          actorId: user.id,
          workspaceId: workspace.id,
        },
      });
    }

    return Response.json({ success: true, newTaskStatus, assigneeWorkStatus: workStatus });
  } catch (error) {
    return handleApiError(error);
  }
}
