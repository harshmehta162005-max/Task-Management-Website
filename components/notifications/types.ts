export type NotificationType = "MENTION" | "ASSIGNED" | "DUE_SOON" | "COMMENT" | "SYSTEM";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link: string;
};

