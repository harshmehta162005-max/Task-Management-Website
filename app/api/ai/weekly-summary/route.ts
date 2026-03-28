import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { subDays } from "date-fns";
import { createNotification } from "@/lib/notifications/createNotification";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * POST /api/ai/weekly-summary
 * Generates an AI-powered weekly summary for a whole workspace and delivers
 * it as a notification to all members who have weeklySummaryEnabled.
 *
 * Body: { workspaceId: string }
 */
export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { workspaceId } = body as { workspaceId: string };

    if (!workspaceId) {
      return Response.json({ error: "workspaceId is required" }, { status: 400 });
    }

    // Verify the user is part of the workspace
    const dbUser = await db.user.findFirst({ where: { clerkId }, select: { id: true } });
    if (!dbUser) return Response.json({ error: "User not found" }, { status: 404 });

    const member = await db.workspaceMember.findFirst({
      where: { workspaceId, userId: dbUser.id },
    });
    if (!member) return Response.json({ error: "Not a workspace member" }, { status: 403 });

    // ─── Gather workspace-wide data for the last 7 days ────────────────────
    const since = subDays(new Date(), 7);

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    });
    if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

    // All projects in workspace
    const projects = await db.project.findMany({
      where: { workspaceId, status: "ACTIVE" },
      select: { id: true, name: true },
    });

    // All tasks across all workspace projects
    const projectIds = projects.map((p) => p.id);
    const allTasks = await db.task.findMany({
      where: { projectId: { in: projectIds } },
      select: {
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        updatedAt: true,
        createdAt: true,
        project: { select: { name: true } },
        assignees: { select: { user: { select: { name: true } } } },
      },
    });

    const completedThisWeek = allTasks.filter(
      (t) => t.status === "DONE" && t.updatedAt >= since
    );
    const createdThisWeek = allTasks.filter(
      (t) => t.createdAt >= since
    );
    const blockers = allTasks.filter((t) => t.status === "BLOCKED");
    const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS");
    const overdue = allTasks.filter(
      (t) => t.dueDate && t.dueDate < new Date() && t.status !== "DONE" && t.status !== "CANCELLED"
    );

    // Recent activities
    const activities = await db.activity.findMany({
      where: { workspaceId, createdAt: { gte: since } },
      select: { action: true, entityType: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Workspace members count
    const memberCount = await db.workspaceMember.count({ where: { workspaceId } });

    // ─── Build the AI prompt ───────────────────────────────────────────────
    const context = `
Workspace: ${workspace.name}
Team size: ${memberCount} members
Active projects: ${projects.map((p) => p.name).join(", ")}
Period: Last 7 days

Tasks created this week: ${createdThisWeek.length}
Tasks completed this week: ${completedThisWeek.length}
${completedThisWeek.slice(0, 10).map((t) => `  ✓ ${t.title} (${t.project.name})`).join("\n")}

Currently in progress: ${inProgress.length}
${inProgress.slice(0, 10).map((t) => `  → ${t.title} [${t.priority}] (${t.project.name})`).join("\n")}

Blocked tasks: ${blockers.length}
${blockers.slice(0, 10).map((t) => `  ⚠ ${t.title} (${t.project.name})`).join("\n")}

Overdue tasks: ${overdue.length}
${overdue.slice(0, 10).map((t) => `  🔴 ${t.title} – due ${t.dueDate?.toLocaleDateString()} (${t.project.name})`).join("\n")}

Recent activity highlights (${activities.length} total actions):
${activities.slice(0, 15).map((a) => `  - ${a.action} on ${a.entityType}`).join("\n")}
    `.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are an AI project manager. Write a comprehensive yet concise weekly digest for the workspace based on the data below.

Structure your response as:
1. **Overview** – A 2-sentence high-level summary of the week's progress.
2. **Key Achievements** – Bullet list of notable completed work.
3. **Risks & Attention Needed** – Highlight overdue tasks, blockers, and any trends that need attention.
4. **Outlook** – A brief statement on what to focus on next week.

Use specific numbers from the data. Format using markdown.

${context}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // ─── Deliver the summary as a notification to eligible members ──────────
    const allMembers = await db.workspaceMember.findMany({
      where: { workspaceId },
      select: { userId: true },
    });

    // Find who has weekly summary enabled
    const allMemberUserIds = allMembers.map((m) => m.userId);
    const settingsRows = await db.notificationSettings.findMany({
      where: { userId: { in: allMemberUserIds } },
    });
    const settingsMap = new Map(settingsRows.map((s) => [s.userId, s]));

    const eligibleUserIds = allMemberUserIds.filter((uid) => {
      const s = settingsMap.get(uid);
      // If no settings → default is enabled
      if (!s) return true;
      return s.weeklySummaryEnabled;
    });

    // Create notifications for eligible users
    for (const userId of eligibleUserIds) {
      await createNotification({
        type: "AI_WEEKLY_SUMMARY",
        category: "ai",
        title: `Weekly Summary – ${workspace.name}`,
        body: summary,
        userId,
        workspaceId,
      });
    }

    return Response.json({
      summary,
      deliveredTo: eligibleUserIds.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[AI/WEEKLY-SUMMARY]", msg);
    if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("quota")) {
      return Response.json({ error: "Rate limit reached. Please wait a moment and try again." }, { status: 429 });
    }
    return Response.json({ error: "Failed to generate weekly summary" }, { status: 500 });
  }
}
