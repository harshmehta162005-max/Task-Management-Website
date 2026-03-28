export type RoleItem = {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  memberCount: number;
  permissions?: string[];
};

export type PermissionGroup = {
  key: string;
  label: string;
  permissions: PermissionItem[];
};

export type PermissionItem = {
  key: string;
  label: string;
  description: string;
};

export const DEFAULT_ROLES: RoleItem[] = [
  {
    id: "r-admin",
    name: "Admin",
    description: "Full access to all workspace settings, billing, and data.",
    isSystem: true,
    memberCount: 5,
  },
  {
    id: "r-manager",
    name: "Manager",
    description: "Manage projects, tasks, and members but not billing.",
    isSystem: true,
    memberCount: 3,
  },
  {
    id: "r-member",
    name: "Member",
    description: "Standard access for daily work and task updates.",
    isSystem: true,
    memberCount: 18,
  },
  {
    id: "r-viewer",
    name: "Viewer",
    description: "Read-only access to projects and tasks.",
    isSystem: false,
    memberCount: 2,
  },
];

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: "projects",
    label: "Projects",
    permissions: [
      { key: "project.create", label: "Create project", description: "Can start new projects" },
      { key: "project.edit", label: "Edit project", description: "Update project metadata" },
      { key: "project.archive", label: "Archive project", description: "Archive completed or inactive projects" },
      { key: "project.delete", label: "Delete project", description: "Permanently remove projects" },
    ],
  },
  {
    key: "tasks",
    label: "Tasks",
    permissions: [
      { key: "task.create", label: "Create task", description: "Add tasks in any project" },
      { key: "task.edit", label: "Edit task", description: "Change task details and fields" },
      { key: "task.assign", label: "Assign task", description: "Assign tasks to members" },
      { key: "task.move", label: "Move task status", description: "Change task status in board/list" },
      { key: "task.delete", label: "Delete task", description: "Permanently delete tasks" },
    ],
  },
  {
    key: "members",
    label: "Members",
    permissions: [
      { key: "members.invite", label: "Invite members", description: "Send invitations to join workspace" },
      { key: "members.roles", label: "Change roles", description: "Modify member roles and permissions" },
      { key: "members.remove", label: "Remove members", description: "Remove members from workspace" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    permissions: [
      { key: "settings.profile", label: "Edit workspace profile", description: "Update workspace name, slug, logo" },
      { key: "settings.tags", label: "Manage tags", description: "Create and edit tags" },
      { key: "settings.notifications", label: "Manage notifications", description: "Configure notification defaults" },
      { key: "settings.roles", label: "Manage roles", description: "Create, edit, and delete roles" },
      { key: "settings.delete", label: "Delete workspace", description: "Permanently delete workspace" },
    ],
  },
];

export type RolePermissionState = Record<string, boolean>;

export const defaultPermStateForRole = (role: RoleItem): RolePermissionState => {
  // System defaults
  if (role.id === "r-admin") {
    return Object.fromEntries(PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => [p.key, true])));
  }
  if (role.id === "r-manager") {
    return Object.fromEntries(
      PERMISSION_GROUPS.flatMap((g) =>
        g.permissions.map((p) => [
          p.key,
          !["project.delete", "settings.roles", "settings.delete"].includes(p.key),
        ])
      )
    );
  }
  if (role.id === "r-member") {
    return Object.fromEntries(
      PERMISSION_GROUPS.flatMap((g) =>
        g.permissions.map((p) => [
          p.key,
          ["task.create", "task.edit", "task.assign", "task.move", "project.edit"].includes(p.key),
        ])
      )
    );
  }
  // Custom role defaults to read-only (false)
  return Object.fromEntries(PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => [p.key, false])));
};
