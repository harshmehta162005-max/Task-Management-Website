export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: "active" | "archived";
  members: string[];
  totalTasks: number;
  completedTasks: number;
  blockedTasks: number;
  overdueTasks: number;
  accentColor: string; // e.g. "text-primary"
  accentBg: string; // e.g. "bg-primary/10"
  icon: string; // lucide icon name to render via passed component
};

export type NewProjectInput = {
  name: string;
  description?: string;
  members: string[];
};
