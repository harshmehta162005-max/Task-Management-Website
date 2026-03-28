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
export type DrawerDependency = { id: string; name: string; avatar?: string };

/** A workspace-managed tag with id, name, and color */
export type WorkspaceTag = { id: string; name: string; color: string };

export type DrawerTask = {
  id: string;
  title: string;
  status: DrawerStatus;
  priority: DrawerPriority;
  dueDate?: string | null;
  assignees: DrawerAssignee[];
  tags: WorkspaceTag[];
  description?: string;
  attachments?: DrawerAttachment[];
  comments?: DrawerComment[];
  activity?: DrawerActivity[];
  subtasks?: DrawerSubtask[];
  dependencies?: { blockedBy: DrawerDependency[]; blocking: DrawerDependency[] };
  projectId?: string;
  creatorId?: string;
  isCreator?: boolean;
};
