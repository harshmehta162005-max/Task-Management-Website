import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/dashboard?workspaceSlug=xxx
 * Aggregated dashboard data.
 */
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace, user } = await resolveWorkspace(slug);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    // --- Stats ---
    const [totalActive, overdue, blocked, dueToday] = await Promise.all([
      db.task.count({
        where: { project: { workspaceId: workspace.id }, status: { notIn: ["DONE", "CANCELLED"] } },
      }),
      db.task.count({
        where: {
          project: { workspaceId: workspace.id },
          status: { notIn: ["DONE", "CANCELLED"] },
          dueDate: { lt: startOfDay },
        },
      }),
      db.task.count({
        where: { project: { workspaceId: workspace.id }, status: "BLOCKED" },
      }),
      db.task.count({
        where: {
          project: { workspaceId: workspace.id },
          status: { notIn: ["DONE", "CANCELLED"] },
          dueDate: { gte: startOfDay, lte: endOfDay },
        },
      }),
    ]);

    const stats = [
      { label: "Total Active", value: totalActive },
      { label: "Overdue", value: overdue },
      { label: "Blocked", value: blocked },
      { label: "Due Today", value: dueToday },
    ];

    // --- Tasks due today for current user ---
    const myTasksToday = await db.task.findMany({
      where: {
        project: { workspaceId: workspace.id },
        assignees: { some: { userId: user.id } },
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        project: { select: { name: true } },
      },
      take: 5,
      orderBy: { dueDate: "asc" },
    });

    const tasksToday = myTasksToday.map((t) => ({
      id: t.id,
      title: t.title,
      project: t.project.name,
      priority: t.priority as "URGENT" | "HIGH" | "MEDIUM" | "LOW",
      due: t.dueDate ? formatTimeLeft(t.dueDate) : "No time set",
    }));

    // --- Member workloads ---
    const members = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: { user: { select: { id: true, name: true } } },
    });

    const workloads = await Promise.all(
      members.map(async (m) => {
        const count = await db.task.count({
          where: {
            project: { workspaceId: workspace.id },
            assignees: { some: { userId: m.userId } },
            status: { notIn: ["DONE", "CANCELLED"] },
          },
        });
        return { name: m.user.name ?? "Unknown", load: Math.min(Math.round((count / Math.max(totalActive, 1)) * 100), 100) };
      })
    );

    // --- Projects overview ---
    const projects = await db.project.findMany({
      where: { workspaceId: workspace.id, status: "ACTIVE" },
      include: {
        members: { include: { user: { select: { avatarUrl: true } } } },
        _count: { select: { tasks: true } },
      },
      take: 4,
      orderBy: { updatedAt: "desc" },
    });

    const projectsOverview = await Promise.all(
      projects.map(async (p) => {
        const done = await db.task.count({ where: { projectId: p.id, status: "DONE" } });
        const total = p._count.tasks;
        const overdueCount = await db.task.count({
          where: { projectId: p.id, status: { notIn: ["DONE", "CANCELLED"] }, dueDate: { lt: now } },
        });
        return {
          id: p.id,
          name: p.name,
          description: p.description ?? "",
          progress: total > 0 ? Math.round((done / total) * 100) : 0,
          avatars: p.members.map((m) => m.user.avatarUrl ?? ""),
          overdue: overdueCount > 0,
          href: `/${slug}/projects/${p.id}`,
        };
      })
    );

    // --- Risky tasks ---
    const atRiskTasks = await db.task.findMany({
      where: {
        project: { workspaceId: workspace.id },
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: { gte: now, lte: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) },
      },
      include: { assignees: { include: { user: { select: { name: true } } } } },
      take: 3,
    });

    const staleTasks = await db.task.findMany({
      where: {
        project: { workspaceId: workspace.id },
        status: { notIn: ["DONE", "CANCELLED"] },
        updatedAt: { lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
      },
      include: { assignees: { include: { user: { select: { name: true } } } } },
      take: 3,
    });

    // --- Attention panel ---
    const overdueTasks = await db.task.findMany({
      where: {
        project: { workspaceId: workspace.id },
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: { lt: startOfDay },
      },
      select: { title: true },
      take: 4,
    });
    const blockedTasks = await db.task.findMany({
      where: { project: { workspaceId: workspace.id }, status: "BLOCKED" },
      select: { title: true },
      take: 4,
    });

    // --- Recent activity ---
    const recentActivity = await db.activity.findMany({
      where: { workspaceId: workspace.id },
      include: {
        actor: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const activityItems = recentActivity.map((a) => ({
      actor: a.actor.name?.split(" ")[0] ?? "User",
      action: a.action,
      entity: (a.metadata as Record<string, string>)?.entityName ?? a.entityType,
      href: `/${slug}/projects`,
      time: formatTimeAgo(a.createdAt),
      avatar: a.actor.avatarUrl ?? "",
    }));

    return Response.json({
      stats,
      tasksToday,
      members: workloads,
      projects: projectsOverview,
      riskyAtRisk: atRiskTasks.map((t) => ({
        title: t.title,
        due: t.dueDate ? formatTimeLeft(t.dueDate) : "",
        assignee: t.assignees[0]?.user.name ?? "Unassigned",
      })),
      riskyStale: staleTasks.map((t) => ({
        title: t.title,
        due: `${Math.round((now.getTime() - t.updatedAt.getTime()) / (1000 * 60 * 60 * 24))}d stale`,
        assignee: t.assignees[0]?.user.name ?? "Unassigned",
      })),
      attentionOverdue: overdueTasks.map((t) => ({ title: t.title, detail: "" })),
      attentionBlocked: blockedTasks.map((t) => ({ title: t.title, detail: "" })),
      attentionOverloaded: workloads.filter((w) => w.load > 80).map((w) => ({ name: w.name })),
      activityItems,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function formatTimeLeft(date: Date): string {
  const diff = date.getTime() - Date.now();
  const hours = Math.round(diff / (1000 * 60 * 60));
  if (hours < 0) return "Overdue";
  if (hours < 1) return "< 1h left";
  if (hours < 24) return `${hours}h left`;
  return `${Math.ceil(hours / 24)}d left`;
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / (1000 * 60));
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.round(hours / 24)}d ago`;
}
