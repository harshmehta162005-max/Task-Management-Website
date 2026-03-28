/**
 * ─── RBAC PERMISSION KEYS ───────────────────────────────────────────────────
 *
 * Single source of truth for all permission keys used throughout the system.
 * Must match the keys stored in Role.permissions JSON array in the database.
 * Also used by the frontend rolesData.ts for display.
 */

// ─── Project Permissions ─────────────────────────────────────
export const P_PROJECT_CREATE = "project.create";
export const P_PROJECT_EDIT = "project.edit";
export const P_PROJECT_ARCHIVE = "project.archive";
export const P_PROJECT_DELETE = "project.delete";
export const P_PROJECT_VIEW = "project.view";

// ─── Task Permissions ────────────────────────────────────────
export const P_TASK_CREATE = "task.create";
export const P_TASK_EDIT = "task.edit";
export const P_TASK_ASSIGN = "task.assign";
export const P_TASK_MOVE = "task.move";
export const P_TASK_DELETE = "task.delete";
export const P_TASK_COMMENT = "task.comment";

// ─── Members Permissions ─────────────────────────────────────
export const P_MEMBERS_INVITE = "members.invite";
export const P_MEMBERS_ROLES = "members.roles";
export const P_MEMBERS_REMOVE = "members.remove";

// ─── Settings Permissions ────────────────────────────────────
export const P_SETTINGS_PROFILE = "settings.profile";
export const P_SETTINGS_TAGS = "settings.tags";
export const P_SETTINGS_NOTIFICATIONS = "settings.notifications";
export const P_SETTINGS_ROLES = "settings.roles";
export const P_SETTINGS_DELETE = "settings.delete";

// ─── Notes Permissions ───────────────────────────────────────
export const P_NOTES_CREATE = "notes.create";
export const P_NOTES_VIEW = "notes.view";
export const P_NOTES_DELETE = "notes.delete";

// ─── AI Permissions ──────────────────────────────────────────
export const P_AI_PROJECT = "ai.project";
export const P_AI_WORKSPACE = "ai.workspace";

// ─── All Permission Keys ────────────────────────────────────
export const ALL_PERMISSIONS = [
  P_PROJECT_CREATE, P_PROJECT_EDIT, P_PROJECT_ARCHIVE, P_PROJECT_DELETE, P_PROJECT_VIEW,
  P_TASK_CREATE, P_TASK_EDIT, P_TASK_ASSIGN, P_TASK_MOVE, P_TASK_DELETE, P_TASK_COMMENT,
  P_MEMBERS_INVITE, P_MEMBERS_ROLES, P_MEMBERS_REMOVE,
  P_SETTINGS_PROFILE, P_SETTINGS_TAGS, P_SETTINGS_NOTIFICATIONS, P_SETTINGS_ROLES, P_SETTINGS_DELETE,
  P_NOTES_CREATE, P_NOTES_VIEW, P_NOTES_DELETE,
  P_AI_PROJECT, P_AI_WORKSPACE,
] as const;

export type PermissionKey = (typeof ALL_PERMISSIONS)[number];

// ─── Default Role Permission Sets ────────────────────────────
// Inspired by the existing rolesData.ts defaults (Manager can't manage roles, etc.)

/** Owner: all permissions */
export const OWNER_PERMISSIONS: PermissionKey[] = [...ALL_PERMISSIONS];

/** Admin: everything except deleting workspace */
export const ADMIN_PERMISSIONS: PermissionKey[] = ALL_PERMISSIONS.filter(
  (p) => p !== P_SETTINGS_DELETE
);

/** Manager: projects/tasks/members but NOT roles, workspace deletion, or project deletion */
export const MANAGER_PERMISSIONS: PermissionKey[] = ALL_PERMISSIONS.filter(
  (p) => ![
    P_PROJECT_DELETE,
    P_SETTINGS_ROLES,
    P_SETTINGS_DELETE,
    P_MEMBERS_ROLES,
  ].includes(p)
);

/** Member: standard daily work — create/edit tasks, comment, view projects, notes */
export const MEMBER_PERMISSIONS: PermissionKey[] = [
  P_PROJECT_VIEW,
  P_TASK_CREATE,
  P_TASK_EDIT,
  P_TASK_ASSIGN,
  P_TASK_MOVE,
  P_TASK_COMMENT,
  P_NOTES_VIEW,
  P_NOTES_CREATE,
  P_AI_PROJECT,
];

/** Viewer: read-only access */
export const VIEWER_PERMISSIONS: PermissionKey[] = [
  P_PROJECT_VIEW,
  P_NOTES_VIEW,
];
