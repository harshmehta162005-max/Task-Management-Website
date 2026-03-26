import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/notifications
 * List notifications for the current user.
 */
export async function GET() {
  try {
    const user = await getDbUser();

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        actor: { select: { name: true, avatarUrl: true } },
      },
    });

    return Response.json(
      notifications.map((n) => ({
        id: n.id,
        type: n.type,
        category: n.category,
        title: n.title,
        message: n.body ?? "",
        createdAt: formatTimeAgo(n.createdAt),
        isRead: n.read,
        link: n.linkUrl ?? "",
        actorName: n.actor?.name ?? undefined,
        actorAvatar: n.actor?.avatarUrl ?? undefined,
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/notifications  (mark individual as read)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    const body = await req.json();
    const { id } = body;
    if (!id) throw new ApiError(400, "Notification id is required");

    await db.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    });

    return Response.json({ ok: true });
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
