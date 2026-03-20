export type ActivityTarget =
  | { kind: "task"; id: string; label: string; projectId: string }
  | { kind: "project"; id: string; label: string }
  | { kind: "member"; id: string; label: string };

export type ActivityItemType = "tasks" | "projects" | "members" | "settings" | "automations" | "security";
export type ActivitySeverity = "info" | "admin" | "security";

export type ActivityActor = { id: string; name: string; avatarUrl?: string };

export type ActivityLogItem = {
  id: string;
  type: ActivityItemType;
  actor: ActivityActor;
  actionText: string;
  target: ActivityTarget;
  createdAt: string; // ISO
  severity?: ActivitySeverity;
};
