export type Task = {
  id: string;
  title: string;
  status: "Todo" | "In Progress" | "Blocked" | "Done";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignees: string[];
  dueDate: string; // ISO date
  tags: string[];
  updatedAt: string; // ISO date
};

export type Activity = {
  id: string;
  actor: string;
  avatar: string;
  action: string;
  entity: string;
  entityType: "task" | "project";
  timestamp: string;
};
