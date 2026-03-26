import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/prisma";
import { parseTasksFromNotes } from "@/lib/ai/tools/taskTools";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { workspaceId, notes, projectId } = body as {
      workspaceId: string;
      notes: string;
      projectId: string;
    };

    if (!workspaceId || !notes?.trim() || !projectId) {
      return Response.json(
        { error: "workspaceId, notes and projectId are required" },
        { status: 400 }
      );
    }

    // Parse tasks via Gemini
    const proposedTasks = await parseTasksFromNotes(notes);

    // Check for duplicate titles in the same project
    const existingTitles = await db.task.findMany({
      where: { projectId },
      select: { title: true },
    });
    const existingSet = new Set(existingTitles.map((t) => t.title.toLowerCase()));

    const tasksWithDupeFlag = proposedTasks.map((t, i) => ({
      id: `proposed-${i}`,
      title: t.title,
      assignee: t.assignee,
      due: t.due,
      duplicate: existingSet.has(t.title.toLowerCase()),
    }));

    return Response.json({ tasks: tasksWithDupeFlag });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[AI/MEETING-TO-TASKS]", msg);
    if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("quota")) {
      return Response.json({ error: "Rate limit reached. Please wait a moment and try again." }, { status: 429 });
    }
    return Response.json({ error: "Failed to extract tasks" }, { status: 500 });
  }
}
