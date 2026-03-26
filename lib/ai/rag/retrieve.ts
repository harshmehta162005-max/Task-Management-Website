import { db } from "@/lib/db/prisma";

/**
 * Build context string for a user's personal data.
 * Used in PERSONAL mode — gives the LLM knowledge of user's projects, tasks, and notes.
 */
export async function buildPersonalContext(userId: string, workspaceId: string): Promise<string> {
  const lines: string[] = [];

  // User info
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });
  lines.push(`# Your Profile`);
  lines.push(`Name: ${user?.name ?? "Unknown"} | Email: ${user?.email ?? "Unknown"}`);

  // Projects the user is a member of
  const memberships = await db.projectMember.findMany({
    where: { userId, project: { workspaceId } },
    select: {
      role: true,
      project: {
        select: {
          id: true,
          name: true,
          status: true,
          description: true,
          _count: { select: { tasks: true } },
        },
      },
    },
  });

  lines.push(`\n# Your Projects (${memberships.length})`);
  for (const m of memberships) {
    const p = m.project;
    lines.push(`- ${p.name} [${p.status}] (${m.role}) — ${p._count.tasks} tasks${p.description ? ` | ${p.description}` : ""}`);
  }

  // Tasks assigned to the user
  const tasks = await db.taskAssignee.findMany({
    where: { userId, task: { project: { workspaceId } } },
    select: {
      task: {
        select: {
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          project: { select: { name: true } },
        },
      },
    },
    take: 40,
  });

  const activeTasks = tasks.filter((t) => !["DONE", "CANCELLED"].includes(t.task.status));
  const doneTasks = tasks.filter((t) => t.task.status === "DONE");

  lines.push(`\n# Your Active Tasks (${activeTasks.length})`);
  for (const t of activeTasks) {
    const due = t.task.dueDate ? ` | Due: ${t.task.dueDate.toISOString().split("T")[0]}` : "";
    lines.push(`- [${t.task.status}] "${t.task.title}" | ${t.task.priority}${due} | Project: ${t.task.project.name}`);
  }

  if (doneTasks.length > 0) {
    lines.push(`\n# Recently Completed (${doneTasks.length})`);
    for (const t of doneTasks.slice(0, 10)) {
      lines.push(`- ✓ "${t.task.title}" | Project: ${t.task.project.name}`);
    }
  }

  // Calendar notes authored by user
  const notes = await db.calendarNote.findMany({
    where: { authorId: userId, project: { workspaceId } },
    orderBy: { date: "desc" },
    take: 15,
    select: {
      content: true,
      date: true,
      project: { select: { name: true } },
    },
  });

  if (notes.length > 0) {
    lines.push(`\n# Your Recent Notes (${notes.length})`);
    for (const n of notes) {
      lines.push(`- [${n.date.toISOString().split("T")[0]}] ${n.project.name}: ${n.content.slice(0, 120)}`);
    }
  }

  // Quick stats
  const overdue = activeTasks.filter(
    (t) => t.task.dueDate && t.task.dueDate < new Date()
  ).length;
  const urgent = activeTasks.filter((t) => t.task.priority === "URGENT").length;

  lines.push(`\n# Quick Stats`);
  lines.push(`- Active tasks: ${activeTasks.length} | Completed: ${doneTasks.length} | Overdue: ${overdue} | Urgent: ${urgent}`);
  lines.push(`- Projects enrolled: ${memberships.length}`);

  return lines.join("\n");
}

/**
 * Build context string for a single project.
 * Used in PROJECT mode.
 */
export async function buildProjectContext(projectId: string): Promise<string> {
  const lines: string[] = [];

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { name: true, description: true },
  });
  if (!project) return "Project not found.";

  lines.push(`# Project: ${project.name}`);
  if (project.description) lines.push(`Description: ${project.description}`);

  // Tasks
  const tasks = await db.task.findMany({
    where: { projectId },
    select: {
      title: true,
      status: true,
      priority: true,
      dueDate: true,
      assignees: { select: { user: { select: { name: true } } } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  lines.push(`\n## Tasks (${tasks.length})`);
  for (const t of tasks) {
    const names = t.assignees.map((a) => a.user.name ?? "Unassigned").join(", ");
    const due = t.dueDate ? ` | Due: ${t.dueDate.toISOString().split("T")[0]}` : "";
    lines.push(`- [${t.status}] "${t.title}" | ${t.priority}${due} | ${names}`);
  }

  // Stats
  const todo = tasks.filter((t) => t.status === "TODO").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const blocked = tasks.filter((t) => t.status === "BLOCKED").length;
  const done = tasks.filter((t) => t.status === "DONE").length;

  lines.push(`\n## Summary`);
  lines.push(`- TODO: ${todo} | In Progress: ${inProgress} | Blocked: ${blocked} | Done: ${done}`);

  // Members
  const members = await db.projectMember.findMany({
    where: { projectId },
    select: { user: { select: { name: true } }, role: true },
  });

  lines.push(`\n## Team (${members.length})`);
  for (const m of members) {
    lines.push(`- ${m.user.name ?? "Unknown"} (${m.role})`);
  }

  return lines.join("\n");
}

/**
 * Build context string for the entire workspace.
 * Used in WORKSPACE mode (admin-only).
 */
export async function buildWorkspaceContext(workspaceId: string): Promise<string> {
  const lines: string[] = [];

  // All projects
  const projects = await db.project.findMany({
    where: { workspaceId },
    select: {
      id: true,
      name: true,
      status: true,
      _count: { select: { tasks: true } },
    },
  });

  lines.push(`# Workspace Overview`);
  lines.push(`Total projects: ${projects.length}`);

  // Per-project stats
  for (const p of projects) {
    const statusCounts = await db.task.groupBy({
      by: ["status"],
      where: { projectId: p.id },
      _count: true,
    });
    const counts: Record<string, number> = {};
    for (const s of statusCounts) counts[s.status] = s._count;

    const overdue = await db.task.count({
      where: {
        projectId: p.id,
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: { lt: new Date() },
      },
    });

    lines.push(`\n## ${p.name} [${p.status}]`);
    lines.push(`- Total: ${p._count.tasks} | TODO: ${counts["TODO"] ?? 0} | In Progress: ${counts["IN_PROGRESS"] ?? 0} | Blocked: ${counts["BLOCKED"] ?? 0} | Done: ${counts["DONE"] ?? 0} | Overdue: ${overdue}`);
  }

  // Team workload
  const members = await db.workspaceMember.findMany({
    where: { workspaceId },
    select: {
      user: {
        select: {
          name: true,
          taskAssignments: {
            where: {
              task: {
                status: { notIn: ["DONE", "CANCELLED"] },
                project: { workspaceId },
              },
            },
            select: { task: { select: { priority: true } } },
          },
        },
      },
    },
  });

  lines.push(`\n# Team Workload`);
  for (const m of members) {
    const count = m.user.taskAssignments.length;
    const urgent = m.user.taskAssignments.filter((a) => a.task.priority === "URGENT").length;
    lines.push(`- ${m.user.name ?? "Unknown"}: ${count} active tasks (${urgent} urgent)`);
  }

  return lines.join("\n");
}
