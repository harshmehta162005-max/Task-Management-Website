import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { getDbUser, handleApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for the current user.
 */
export async function POST() {
  try {
    const user = await getDbUser();

    await db.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });

    return Response.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
