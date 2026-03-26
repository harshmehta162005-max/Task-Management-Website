import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/prisma";
import { generateWeeklySummary } from "@/lib/ai/tools/projectTools";
import { createNotification } from "@/lib/notifications/createNotification";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { workspaceId, projectId } = body as {
      workspaceId: string;
      projectId: string;
    };

    if (!workspaceId || !projectId) {
      return Response.json(
        { error: "workspaceId and projectId are required" },
        { status: 400 }
      );
    }

    // Verify project belongs to workspace
    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId },
      select: { id: true },
    });
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const summary = await generateWeeklySummary(projectId);

    // AI_WEEKLY_SUMMARY: notify the user
    const dbUser = await db.user.findFirst({ where: { clerkId }, select: { id: true } });
    if (dbUser) {
      const projectInfo = await db.project.findUnique({ where: { id: projectId }, select: { name: true } });
      await createNotification({
        type: "AI_WEEKLY_SUMMARY",
        category: "ai",
        title: `Weekly summary ready for ${projectInfo?.name ?? "project"}`,
        body: `AI has generated a weekly summary. Check the AI tools panel to view it.`,
        userId: dbUser.id,
        workspaceId,
      });
    }

    return Response.json({ summary });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[AI/SUMMARIZE-PROJECT]", msg);
    if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("quota")) {
      return Response.json({ error: "Rate limit reached. Please wait a moment and try again." }, { status: 429 });
    }
    return Response.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
