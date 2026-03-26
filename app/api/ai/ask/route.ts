import { db } from "@/lib/db/prisma";
import { resolveWorkspace } from "@/lib/workspace/resolveWorkspace";
import { buildProjectContext, buildWorkspaceContext } from "@/lib/ai/rag/retrieve";
import { askGemini, HistoryMessage } from "@/lib/ai/rag/answer";
import type { ChatMode } from "@/lib/ai/systemPrompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceSlug, message, mode = "personal", projectId } = body as {
      workspaceSlug: string;
      message: string;
      mode?: ChatMode;
      projectId?: string;
    };

    if (!workspaceSlug || !message?.trim()) {
      return Response.json({ error: "workspaceSlug and message are required" }, { status: 400 });
    }

    // Resolve workspace + user + permissions
    const { workspace, user, isAdmin, isOwner } = await resolveWorkspace(workspaceSlug);

    // Permission check: workspace mode requires admin/owner
    if (mode === "workspace" && !isAdmin && !isOwner) {
      return Response.json({ error: "Workspace chat is only available for admins" }, { status: 403 });
    }

    // Build context based on mode
    let contextData: string | null = null;

    if (mode === "project" && projectId) {
      contextData = await buildProjectContext(projectId);
    } else if (mode === "workspace") {
      contextData = await buildWorkspaceContext(workspace.id);
    }
    // personal mode: no context injected

    // Fetch last 20 messages for this mode
    const pastMessages = await db.aiChatHistory.findMany({
      where: {
        workspaceId: workspace.id,
        userId: user.id,
        mode,
        ...(mode === "project" && projectId ? { projectId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { role: true, content: true },
    });

    const history: HistoryMessage[] = pastMessages
      .reverse()
      .map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: m.content }],
      }));

    // Call Gemini with mode-appropriate prompt
    const reply = await askGemini(mode, contextData, history, message);

    // Persist both messages
    await db.aiChatHistory.createMany({
      data: [
        { workspaceId: workspace.id, userId: user.id, role: "user", content: message, mode, projectId: projectId ?? null },
        { workspaceId: workspace.id, userId: user.id, role: "assistant", content: reply, mode, projectId: projectId ?? null },
      ],
    });

    return Response.json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack?.split("\n").slice(0, 3).join(" | ") : "";
    console.error("[AI/ASK]", msg, stack);
    if (msg.includes("429") || msg.includes("Too Many Requests") || msg.includes("quota")) {
      return Response.json({ error: "Rate limit reached. Please wait a moment and try again." }, { status: 429 });
    }
    return Response.json({ error: "AI request failed", detail: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const workspaceSlug = url.searchParams.get("workspaceSlug");
    const mode = (url.searchParams.get("mode") ?? "personal") as ChatMode;
    const projectId = url.searchParams.get("projectId");

    if (!workspaceSlug) return Response.json({ error: "workspaceSlug required" }, { status: 400 });

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    const history = await db.aiChatHistory.findMany({
      where: {
        workspaceId: workspace.id,
        userId: user.id,
        mode,
        ...(mode === "project" && projectId ? { projectId } : {}),
      },
      orderBy: { createdAt: "asc" },
      take: 50,
      select: { id: true, role: true, content: true, mode: true, projectId: true, createdAt: true },
    });

    return Response.json({ history });
  } catch (err) {
    console.error("[AI/ASK GET]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const workspaceSlug = url.searchParams.get("workspaceSlug");
    const mode = (url.searchParams.get("mode") ?? "personal") as ChatMode;
    const projectId = url.searchParams.get("projectId");

    if (!workspaceSlug) return Response.json({ error: "workspaceSlug required" }, { status: 400 });

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    await db.aiChatHistory.deleteMany({
      where: {
        workspaceId: workspace.id,
        userId: user.id,
        mode,
        ...(mode === "project" && projectId ? { projectId } : {}),
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[AI/ASK DELETE]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to clear history" }, { status: 500 });
  }
}
