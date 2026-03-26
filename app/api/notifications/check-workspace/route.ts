import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError } from "@/lib/workspace/resolveWorkspace";
import { notifyWorkspaceAdmins } from "@/lib/notifications/createNotification";

/**
 * POST /api/notifications/check-workspace
 * Called on dashboard load for admins.
 * Checks for high-value workspace-level conditions and creates notifications (deduped by 24h).
 */
export async function POST(req: Request) {
  try {
    const user = await getDbUser();
    const body = await req.json();
    const { workspaceId } = body as { workspaceId: string };

    if (!workspaceId) {
      return Response.json({ error: "workspaceId is required" }, { status: 400 });
    }

    // Verify user is admin/owner
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { id: true, ownerId: true, slug: true },
    });
    if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

    const isOwner = workspace.ownerId === user.id;
    const membership = await db.workspaceMember.findFirst({
      where: { workspaceId, userId: user.id },
      include: { role: { select: { name: true } } },
    });
    const isAdmin = membership?.role?.name === "Admin" || membership?.role?.name === "ADMIN";

    if (!isOwner && !isAdmin) {
      return Response.json({ checked: false, reason: "Not an admin" });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const created: string[] = [];

    // ── 1. PROJECT_AT_RISK: Projects with >30% overdue tasks ──
    const projects = await db.project.findMany({
      where: { workspaceId, status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        _count: { select: { tasks: true } },
        tasks: {
          where: { dueDate: { lt: now }, status: { notIn: ["DONE", "CANCELLED"] } },
          select: { id: true },
        },
      },
    });

    for (const proj of projects) {
      const total = proj._count.tasks;
      const overdue = proj.tasks.length;
      if (total >= 5 && overdue / total > 0.3) {
        // Dedup: check if already notified in last 24h
        const existing = await db.notification.findFirst({
          where: {
            type: "PROJECT_AT_RISK",
            workspaceId,
            createdAt: { gte: oneDayAgo },
            title: { contains: proj.name },
            read: false,
          },
        });
        if (!existing) {
          await notifyWorkspaceAdmins(workspaceId, "", {
            type: "PROJECT_AT_RISK",
            category: "workspace",
            title: `🚨 "${proj.name}" is at risk`,
            body: `${overdue} of ${total} tasks are overdue (${Math.round((overdue / total) * 100)}%)`,
            workspaceId,
            linkUrl: `/${workspace.slug}/projects/${proj.id}`,
          });
          created.push(`PROJECT_AT_RISK:${proj.name}`);
        }
      }
    }

    // ── 2. TASKS_OVERDUE_BULK: 10+ overdue tasks in workspace ──
    const totalOverdue = await db.task.count({
      where: {
        project: { workspaceId },
        dueDate: { lt: now },
        status: { notIn: ["DONE", "CANCELLED"] },
      },
    });

    if (totalOverdue >= 10) {
      const existing = await db.notification.findFirst({
        where: {
          type: "TASKS_OVERDUE_BULK",
          workspaceId,
          createdAt: { gte: oneDayAgo },
          read: false,
        },
      });
      if (!existing) {
        await notifyWorkspaceAdmins(workspaceId, "", {
          type: "TASKS_OVERDUE_BULK",
          category: "workspace",
          title: `⏳ ${totalOverdue} tasks overdue across workspace`,
          body: `There are ${totalOverdue} overdue tasks that need attention`,
          workspaceId,
          linkUrl: `/${workspace.slug}/dashboard`,
        });
        created.push(`TASKS_OVERDUE_BULK:${totalOverdue}`);
      }
    }

    return Response.json({ checked: true, created });
  } catch (error) {
    return handleApiError(error);
  }
}
