export type DrawerStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type DrawerPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type DrawerAssignee = { id: string; name: string; avatar?: string };
export type DrawerAttachment = { id: string; name: string; size: string; type?: string; uploading?: boolean };
export type DrawerComment = {
  id: string;
  author: DrawerAssignee;
  body: string;
  createdAt: string;
  mine?: boolean;
};
export type DrawerActivity = { id: string; text: string; createdAt: string };
export type DrawerSubtask = { id: string; title: string; completed: boolean };
export type DrawerDependency = { id: string; title: string; status: DrawerStatus };

export type DrawerTask = {
  id: string;
  title: string;
  status: DrawerStatus;
  priority: DrawerPriority;
  dueDate?: string | null;
  assignees: DrawerAssignee[];
  tags: string[];
  description?: string;
  attachments?: DrawerAttachment[];
  comments?: DrawerComment[];
  activity?: DrawerActivity[];
  subtasks?: DrawerSubtask[];
  dependencies?: { blockedBy: DrawerDependency[]; blocking: DrawerDependency[] };
  creatorId?: string;
  isCreator?: boolean;
};
