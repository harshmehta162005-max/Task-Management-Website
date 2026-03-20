import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/activity?workspaceSlug=xxx[&type=xxx][&actor=xxx][&project=xxx]
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const slug = sp.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace } = await resolveWorkspace(slug);
    const type = sp.get("type");
    const actorId = sp.get("actor");
    const q = sp.get("q");

    const where: Record<string, unknown> = { workspaceId: workspace.id };
    if (type) where.entityType = type;
    if (actorId) where.actorId = actorId;

    const items = await db.activity.findMany({
      where,
      include: {
        actor: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    let results = items.map((a) => {
      const meta = (a.metadata ?? {}) as Record<string, string>;
      return {
        id: a.id,
        type: a.entityType as string,
        actor: { id: a.actor.id, name: a.actor.name ?? "User", avatarUrl: a.actor.avatarUrl },
        actionText: a.action,
        target: {
          kind: a.entityType,
          id: a.entityId,
          label: meta.entityName ?? a.entityType,
          projectId: meta.projectId,
        },
        createdAt: formatTimeAgo(a.createdAt),
        severity: meta.severity ?? "info",
      };
    });

    if (q) {
      const lower = q.toLowerCase();
      results = results.filter(
        (r) =>
          r.actor.name.toLowerCase().includes(lower) ||
          r.actionText.toLowerCase().includes(lower) ||
          r.target.label.toLowerCase().includes(lower)
      );
    }

    // Also gather actors and projects for filter dropdowns
    const actors = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
    const projects = await db.project.findMany({
      where: { workspaceId: workspace.id },
      select: { id: true, name: true },
    });

    return Response.json({
      items: results,
      actors: actors.map((a) => ({
        id: a.user.id,
        name: a.user.name ?? a.user.id,
        avatarUrl: a.user.avatarUrl,
      })),
      projects: projects.map((p) => ({ id: p.id, label: p.name })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / (1000 * 60));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
