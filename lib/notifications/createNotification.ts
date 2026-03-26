import { db } from "@/lib/db/prisma";

type NotificationType =
  | "MENTION" | "ASSIGNED" | "COMMENT" | "STATUS_CHANGE" | "DUE_SOON" | "SYSTEM"
  | "TASK_CREATED" | "TASK_COMPLETED" | "NOTE_ADDED"
  | "PROJECT_MEMBER_ADDED" | "PROJECT_MEMBER_REMOVED"
  | "PROJECT_AT_RISK" | "TASKS_OVERDUE_BULK"
  | "AI_BLOCKERS_DETECTED" | "AI_WEEKLY_SUMMARY" | "AI_TASKS_EXTRACTED";

type NotificationCategory = "personal" | "project" | "workspace" | "ai";

type CreateNotificationInput = {
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body?: string;
  userId: string;
  actorId?: string;
  workspaceId?: string;
  linkUrl?: string;
};

/**
 * Create a single notification.
 */
export async function createNotification(input: CreateNotificationInput) {
  // Don't notify yourself
  if (input.actorId && input.actorId === input.userId) return;

  return db.notification.create({ data: input });
}

/**
 * Notify all assignees of a task (except the actor).
 */
export async function notifyTaskAssignees(
  taskId: string,
  excludeUserId: string,
  data: Omit<CreateNotificationInput, "userId">
) {
  const assignees = await db.taskAssignee.findMany({
    where: { taskId },
    select: { userId: true },
  });

  const userIds = assignees
    .map((a) => a.userId)
    .filter((id) => id !== excludeUserId);

  if (userIds.length === 0) return;

  await db.notification.createMany({
    data: userIds.map((userId) => ({ ...data, userId })),
  });
}

/**
 * Notify all members of a project (except the actor).
 */
export async function notifyProjectMembers(
  projectId: string,
  excludeUserId: string,
  data: Omit<CreateNotificationInput, "userId">
) {
  const members = await db.projectMember.findMany({
    where: { projectId },
    select: { userId: true },
  });

  const userIds = members
    .map((m) => m.userId)
    .filter((id) => id !== excludeUserId);

  if (userIds.length === 0) return;

  await db.notification.createMany({
    data: userIds.map((userId) => ({ ...data, userId })),
  });
}

/**
 * Notify all workspace admins + owner (except the actor).
 */
export async function notifyWorkspaceAdmins(
  workspaceId: string,
  excludeUserId: string,
  data: Omit<CreateNotificationInput, "userId">
) {
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: { ownerId: true },
  });

  const adminMembers = await db.workspaceMember.findMany({
    where: { workspaceId, role: { name: { in: ["Admin", "Owner", "ADMIN", "OWNER"] } } },
    select: { userId: true },
  });

  const userIds = new Set(adminMembers.map((m) => m.userId));
  if (workspace) userIds.add(workspace.ownerId);
  userIds.delete(excludeUserId);

  if (userIds.size === 0) return;

  await db.notification.createMany({
    data: Array.from(userIds).map((userId) => ({ ...data, userId })),
  });
}
