import { db } from "@/lib/db/prisma";
import { createNotification } from "@/lib/notifications/createNotification";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type EventType = "status_change" | "due_date_approaching" | "no_update_x_days" | "weekly_schedule";

/**
 * The heart of the Automation system.
 * Evaluates all active automations for the exact eventType and triggers them.
 */
export async function runAutomations(
  eventType: EventType,
  task: any,
  project: any,
  workspace: any,
  actorId: string = "system"
) {
  // 1. Fetch matching automations
  const allAutomations = await db.automation.findMany({
    where: {
      workspaceId: workspace.id,
      enabled: true,
    },
  });

  // 2. Filter automations by Scope & Trigger conditions
  for (const auto of allAutomations) {
    const trigger = auto.trigger as any;
    const action = auto.action as any;

    if (!trigger || !action) continue;

    // Map UI `trigger.type` back to EventType equivalent
    const isStatusTrigger = trigger.type === "status" && eventType === "status_change";
    const isDueTrigger = trigger.type === "due" && eventType === "due_date_approaching";
    const isStaleTrigger = trigger.type === "stale" && eventType === "no_update_x_days";
    const isWeeklyTrigger = trigger.type === "weekly" && eventType === "weekly_schedule";
    
    if (!isStatusTrigger && !isDueTrigger && !isStaleTrigger && !isWeeklyTrigger) {
      continue;
    }

    // Check scope match
    if (trigger.scope === "Project" && trigger.projectId && trigger.projectId !== project.id) {
      continue;
    }

    // Check condition matching dynamically
    let matchesCondition = false;
    let messageBody = "";

    if (isStatusTrigger) {
      if (task.status === trigger.statusTo) {
        matchesCondition = true;
        messageBody = `Task "${task.title}" was moved to ${task.status}`;
      }
    } else if (isDueTrigger) {
      if (task._daysDiff !== undefined && task._daysDiff <= trigger.dueDays && task._daysDiff >= 0) {
        matchesCondition = true;
        messageBody = `Task "${task.title}" is due in ${trigger.dueDays} days`;
      }
    } else if (isStaleTrigger) {
      if (task._daysSinceUpdate !== undefined && task._daysSinceUpdate >= trigger.staleDays) {
        matchesCondition = true;
        messageBody = `Task "${task.title}" has had no updates for ${trigger.staleDays} days`;
      }
    } else if (isWeeklyTrigger) {
      matchesCondition = true;
      messageBody = `Weekly digest. Project: ${project.name}`;
    }

    if (!matchesCondition) continue;

    // Debounce check: Prevent duplicate spam for cron-jobs
    if (isDueTrigger || isStaleTrigger || isWeeklyTrigger) {
      // Look for a recent activity log indicating this automation ran recently for this task
      const recentLog = await db.activity.findFirst({
        where: {
          action: { startsWith: `[Automation: ${auto.id}]` },
          entityId: task.id,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Run max once per 24hrs per task
        }
      });
      if (recentLog) continue;
    }

    await executeAction(auto, action, task, project, workspace, messageBody, actorId);
  }
}

/**
 * Resolves Target Roles to User IDs
 */
async function getRecipientUserIds(recipientArg: any, project: any, workspace: any): Promise<string[]> {
  const userIds = new Set<string>();
  const recipient = typeof recipientArg === "string" ? { id: recipientArg, name: recipientArg } : (recipientArg || { id: "Assignee" });

  if (recipient.id === "Assignee") {
    // Get all task assignees
    const assignees = await db.taskAssignee.findMany({ where: { taskId: project._taskId } });
    assignees.forEach(a => userIds.add(a.userId));
  } 
  else {
    // Treat recipient.id as an actual workspace Role ID
    const members = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id, roleId: recipient.id },
      select: { userId: true }
    });
    members.forEach(m => userIds.add(m.userId));

    // Retain compatibility if legacy mock strings are still floating around
    if (recipient.id === "Project managers") {
      const managers = await db.projectMember.findMany({
        where: { projectId: project.id, role: "MANAGER" },
        select: { userId: true }
      });
      managers.forEach(m => userIds.add(m.userId));
    } 
    else if (recipient.id === "Workspace admins") {
      const admins = await db.workspaceMember.findMany({
        where: { workspaceId: workspace.id, role: { name: { in: ["Admin", "Owner", "ADMIN", "OWNER"] } } },
        select: { userId: true }
      });
      admins.forEach(a => userIds.add(a.userId));
      userIds.add(workspace.ownerId); // Ensure owner always gets it
    }
  }

  return Array.from(userIds);
}

/**
 * Executes the selected actions (In-App, Email, Activity)
 */
async function executeAction(
  automation: any, 
  actionConfig: any, 
  task: any, 
  project: any, 
  workspace: any,
  messageBody: string,
  actorId: string
) {
  const linkUrl = `/${workspace.slug}/projects?taskId=${task.id}`;
  const targetUserIds = await getRecipientUserIds(actionConfig.recipient, { ...project, _taskId: task.id }, workspace);
  const safeActorId = actorId === "system" ? workspace.ownerId : actorId; // Mock system actor with owner

  // 1. Post to Activity Feed (Always log here for debouncing if it's a cron, but append to project if activity is checked)
  const activityActionStr = `[Automation: ${automation.id}] ${automation.name} triggered: ${messageBody}`;
  
  if (actionConfig.activity) {
    // Visible Activity log in project timeline
    await db.activity.create({
      data: {
        action: activityActionStr,
        entityType: "TASK",
        entityId: task.id,
        metadata: { projectId: project.id, projectName: project.name, automationFired: true },
        actorId: safeActorId,
        workspaceId: workspace.id,
      },
    });
  } else {
    // Hidden system log purely used to prevent duplicate cron runs
    await db.activity.create({
         data: {
           action: activityActionStr,
           entityType: "SYSTEM_LOG",
           entityId: task.id,
           metadata: { hidden: true },
           actorId: safeActorId,
           workspaceId: workspace.id,
         },
       });
  }

  if (targetUserIds.length === 0) return;

  // 2. In-App Notification
  if (actionConfig.inApp) {
    for (const uid of targetUserIds) {
      // Create independent notifications internally
      await createNotification({
        type: "SYSTEM", // Using SYSTEM as generic trigger
        category: "ai", 
        title: `Automation: ${automation.name}`,
        body: messageBody,
        userId: uid,
        actorId: safeActorId,
        workspaceId: workspace.id,
        linkUrl,
      });
    }
  }

  // 3. Send Email
  if (actionConfig.email) {
    for (const uid of targetUserIds) {
      const userRecord = await db.user.findUnique({ where: { id: uid }, select: { email: true } });
      if (userRecord?.email) {
        try {
          await resend.emails.send({
            from: "Task Management Automations <onboarding@resend.dev>",
            to: userRecord.email,
            subject: `Automation: ${automation.name}`,
            text: `${messageBody}\n\nView task: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${linkUrl}`,
          });
          console.log(`[EMAIL DISPATCH] Successfully sent to: ${userRecord.email}`);
        } catch (err) {
          console.error(`[EMAIL ERROR] Failed to send to ${userRecord.email}:`, err);
        }
      }
    }
  }
}
