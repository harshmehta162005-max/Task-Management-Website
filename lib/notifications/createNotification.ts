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

// ─── Mapping from notification category → settings column name ───────────────
const CATEGORY_TO_SETTING: Record<NotificationCategory, string> = {
  personal: "notifyCategoryPersonal",
  project: "notifyCategoryProject",
  workspace: "notifyCategoryWorkspace",
  ai: "notifyCategoryAi",
};

/**
 * Check whether the user is currently in their quiet hours window.
 * Returns true if notifications should be suppressed.
 */
function isInQuietHours(settings: {
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  quietHoursTimezone: string;
}): boolean {
  if (!settings.quietHoursEnabled) return false;

  try {
    // Get the current time in the user's timezone
    const nowInTz = new Date(
      new Date().toLocaleString("en-US", { timeZone: settings.quietHoursTimezone })
    );
    const currentMinutes = nowInTz.getHours() * 60 + nowInTz.getMinutes();

    const [startH, startM] = settings.quietHoursStart.split(":").map(Number);
    const [endH, endM] = settings.quietHoursEnd.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    // Handle overnight windows (e.g. 22:00 → 08:00)
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
    // Same-day window (e.g. 13:00 → 15:00)
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } catch {
    // If timezone is invalid, don't suppress
    return false;
  }
}

/**
 * Check whether a notification should be sent to a given user based on their settings.
 * Returns true if the notification should be SKIPPED.
 */
async function shouldSuppressNotification(
  userId: string,
  category: NotificationCategory
): Promise<boolean> {
  const settings = await db.notificationSettings.findUnique({
    where: { userId },
  });

  // No settings record → allow everything (defaults)
  if (!settings) return false;

  // Check category toggle
  const settingKey = CATEGORY_TO_SETTING[category];
  if (settingKey && settingKey in settings) {
    const value = (settings as Record<string, unknown>)[settingKey];
    if (value === false) return true;
  }

  // Check quiet hours
  if (isInQuietHours(settings)) return true;

  return false;
}

/**
 * Bulk-check suppression for multiple users. Returns the filtered list of userIds
 * that should still receive the notification.
 */
async function filterSuppressedUsers(
  userIds: string[],
  category: NotificationCategory
): Promise<string[]> {
  if (userIds.length === 0) return [];

  const settingsRows = await db.notificationSettings.findMany({
    where: { userId: { in: userIds } },
  });

  const settingsMap = new Map(settingsRows.map((s) => [s.userId, s]));
  const settingKey = CATEGORY_TO_SETTING[category];

  return userIds.filter((uid) => {
    const settings = settingsMap.get(uid);
    if (!settings) return true; // no settings → allow

    // Check category toggle
    if (settingKey && settingKey in settings) {
      const value = (settings as Record<string, unknown>)[settingKey];
      if (value === false) return false;
    }

    // Check quiet hours
    if (isInQuietHours(settings)) return false;

    return true;
  });
}

/**
 * Create a single notification.
 */
export async function createNotification(input: CreateNotificationInput) {
  // Don't notify yourself
  if (input.actorId && input.actorId === input.userId) return;

  // Check user's preferences by category
  const suppressed = await shouldSuppressNotification(input.userId, input.category);
  if (suppressed) return;

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

  let userIds = assignees
    .map((a) => a.userId)
    .filter((id) => id !== excludeUserId);

  // Filter based on user settings (by category)
  userIds = await filterSuppressedUsers(userIds, data.category);

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

  let userIds = members
    .map((m) => m.userId)
    .filter((id) => id !== excludeUserId);

  // Filter based on user settings (by category)
  userIds = await filterSuppressedUsers(userIds, data.category);

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

  const userIdSet = new Set(adminMembers.map((m) => m.userId));
  if (workspace) userIdSet.add(workspace.ownerId);
  userIdSet.delete(excludeUserId);

  // Filter based on user settings (by category)
  const userIds = await filterSuppressedUsers(Array.from(userIdSet), data.category);

  if (userIds.length === 0) return;

  await db.notification.createMany({
    data: userIds.map((userId) => ({ ...data, userId })),
  });
}
