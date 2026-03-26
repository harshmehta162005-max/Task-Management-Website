import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/notifications/unread-count
 * Returns the count of unread notifications for the current user.
 */
export async function GET() {
  try {
    const user = await getDbUser();

    const count = await db.notification.count({
      where: { userId: user.id, read: false },
    });

    return Response.json({ count });
  } catch (error) {
    return handleApiError(error);
  }
}
