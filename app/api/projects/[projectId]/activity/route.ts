import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ projectId: string }> };

/**
 * GET /api/projects/[projectId]/activity?workspaceSlug=xxx
 * Get recent activity for a project.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { projectId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    await resolveWorkspace(slug);

    // Fetch activities related to this project
    const activities = await db.activity.findMany({
      where: {
        OR: [
          { entityType: "PROJECT", entityId: projectId },
          { entityType: "TASK", metadata: { path: ["projectId"], equals: projectId } },
        ],
      },
      include: {
        actor: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // If no project-specific activities, get workspace-level ones
    if (activities.length === 0) {
      const wsActivities = await db.activity.findMany({
        where: { workspace: { slug } },
        include: {
          actor: { select: { name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      return Response.json(
        wsActivities.map((a) => ({
          id: a.id,
          avatar: a.actor.avatarUrl ?? "",
          actor: a.actor.name ?? "User",
          action: a.action,
          time: formatTimeAgo(a.createdAt),
        }))
      );
    }

    return Response.json(
      activities.map((a) => ({
        id: a.id,
        avatar: a.actor.avatarUrl ?? "",
        actor: a.actor.name ?? "User",
        action: a.action,
        time: formatTimeAgo(a.createdAt),
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / (1000 * 60));
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
