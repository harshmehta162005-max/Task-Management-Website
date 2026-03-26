export type NotificationType =
  | "MENTION" | "ASSIGNED" | "COMMENT" | "STATUS_CHANGE" | "DUE_SOON" | "SYSTEM"
  | "TASK_CREATED" | "TASK_COMPLETED" | "NOTE_ADDED"
  | "PROJECT_MEMBER_ADDED" | "PROJECT_MEMBER_REMOVED"
  | "PROJECT_AT_RISK" | "TASKS_OVERDUE_BULK"
  | "AI_BLOCKERS_DETECTED" | "AI_WEEKLY_SUMMARY" | "AI_TASKS_EXTRACTED";

export type NotificationCategory = "personal" | "project" | "workspace" | "ai";

export type Notification = {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link: string;
  actorName?: string;
  actorAvatar?: string;
};
