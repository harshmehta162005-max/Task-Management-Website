import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/user/notification-settings
 * Returns the current user's notification settings, creating defaults if none exist.
 */
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.user.findFirst({ where: { clerkId }, select: { id: true, timezone: true } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let settings = await db.notificationSettings.findUnique({ where: { userId: dbUser.id } });

    // Create default settings if none exist
    if (!settings) {
      settings = await db.notificationSettings.create({
        data: {
          userId: dbUser.id,
          quietHoursTimezone: dbUser.timezone || "UTC",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[NOTIFICATION-SETTINGS/GET]", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

/**
 * PATCH /api/user/notification-settings
 * Updates the current user's notification settings.
 */
export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.user.findFirst({ where: { clerkId }, select: { id: true } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();

    // Whitelist fields that can be updated
    const allowed: Record<string, "boolean" | "string"> = {
      inAppEnabled: "boolean",
      emailEnabled: "boolean",
      notifyCategoryPersonal: "boolean",
      notifyCategoryProject: "boolean",
      notifyCategoryWorkspace: "boolean",
      notifyCategoryAi: "boolean",
      weeklySummaryEnabled: "boolean",
      weeklySummaryDay: "string",
      weeklySummaryTime: "string",
      quietHoursEnabled: "boolean",
      quietHoursStart: "string",
      quietHoursEnd: "string",
      quietHoursTimezone: "string",
    };

    const data: Record<string, boolean | string> = {};
    for (const [key, type] of Object.entries(allowed)) {
      if (key in body && typeof body[key] === type) {
        data[key] = body[key];
      }
    }

    const settings = await db.notificationSettings.upsert({
      where: { userId: dbUser.id },
      create: { userId: dbUser.id, ...data },
      update: data,
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[NOTIFICATION-SETTINGS/PATCH]", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
