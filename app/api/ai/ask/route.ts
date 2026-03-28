import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { checkProjectMember } from "@/lib/rbac/checkProjectMember";
import { P_AI_WORKSPACE, P_AI_PROJECT } from "@/lib/rbac/permissions";
import { buildPersonalContext, buildProjectContext, buildWorkspaceContext } from "@/lib/ai/rag/retrieve";
import { askGemini, HistoryMessage } from "@/lib/ai/rag/answer";
import type { ChatMode } from "@/lib/ai/systemPrompts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceSlug, message, mode = "personal", projectId, sessionId } = body as {
      workspaceSlug: string;
      message: string;
      mode?: ChatMode;
      projectId?: string;
      sessionId: string;
    };

    if (!workspaceSlug || !message?.trim() || !sessionId) {
      return Response.json({ error: "workspaceSlug, message and sessionId are required" }, { status: 400 });
    }

    // Resolve workspace + user + permissions based on mode
    let user, workspace;
    try {
      if (mode === "workspace") {
        const ctx = await checkPermission(workspaceSlug, P_AI_WORKSPACE);
        user = ctx.user;
        workspace = ctx.workspace;
      } else if (mode === "project") {
        const ctx = await checkPermission(workspaceSlug, P_AI_PROJECT);
        if (!ctx.isOwner && projectId) {
          await checkProjectMember(ctx.user.id, projectId);
        }
        user = ctx.user;
        workspace = ctx.workspace;
      } else {
        const res = await resolveWorkspace(workspaceSlug);
        user = res.user;
        workspace = res.workspace;
      }
    } catch (error: any) {
      if (error.statusCode) {
        return Response.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    // Verify session exists and belongs to user
    const session = await db.aiChatSession.findFirst({
      where: { id: sessionId, userId: user.id, workspaceId: workspace.id },
    });
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // ── 1. Save user message FIRST (so it persists even if Gemini fails) ──
    await db.aiChatHistory.create({
      data: { sessionId, workspaceId: workspace.id, userId: user.id, role: "user", content: message, mode, projectId: projectId ?? null },
    });

    // Build context based on mode — every mode gets relevant context
    let contextData: string | null = null;
    if (mode === "personal") {
      contextData = await buildPersonalContext(user.id, workspace.id);
    } else if (mode === "project" && projectId) {
      contextData = await buildProjectContext(projectId);
    } else if (mode === "workspace") {
      contextData = await buildWorkspaceContext(workspace.id);
    }

    // Fetch last 20 messages for this session (includes the one we just saved)
    const pastMessages = await db.aiChatHistory.findMany({
      where: { sessionId },
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

    // ── 2. Call Gemini ──
    let reply: string;
    try {
      reply = await askGemini(mode, contextData, history, message);
    } catch (geminiErr) {
      const geminiMsg = geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
      console.error("[AI/ASK] Gemini error:", geminiMsg);

      // Determine user-friendly error message
      const isRateLimit = geminiMsg.includes("429") || geminiMsg.includes("Too Many Requests") || geminiMsg.includes("quota");
      const errorReply = isRateLimit
        ? "⚠️ Rate limit reached. Please wait a moment and try again."
        : "⚠️ AI request failed. Please try again.";

      // Save error as assistant message so it persists in history
      await db.aiChatHistory.create({
        data: { sessionId, workspaceId: workspace.id, userId: user.id, role: "assistant", content: errorReply, mode, projectId: projectId ?? null },
      });

      // Touch session updatedAt
      await db.aiChatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

      // Return the error as a reply so the frontend displays it normally
      return Response.json({ reply: errorReply });
    }

    // ── 3. Save AI reply ──
    await db.aiChatHistory.create({
      data: { sessionId, workspaceId: workspace.id, userId: user.id, role: "assistant", content: reply, mode, projectId: projectId ?? null },
    });

    // Touch session updatedAt
    await db.aiChatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return Response.json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack?.split("\n").slice(0, 3).join(" | ") : "";
    console.error("[AI/ASK]", msg, stack);
    return Response.json({ error: "AI request failed", detail: msg }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const workspaceSlug = url.searchParams.get("workspaceSlug");
    const sessionId = url.searchParams.get("sessionId");

    if (!workspaceSlug || !sessionId) {
      return Response.json({ error: "workspaceSlug and sessionId required" }, { status: 400 });
    }

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    // Verify session ownership
    const session = await db.aiChatSession.findFirst({
      where: { id: sessionId, userId: user.id, workspaceId: workspace.id },
    });
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const history = await db.aiChatHistory.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 100,
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
    const sessionId = url.searchParams.get("sessionId");

    if (!workspaceSlug || !sessionId) {
      return Response.json({ error: "workspaceSlug and sessionId required" }, { status: 400 });
    }

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    // Delete all messages for this session
    await db.aiChatHistory.deleteMany({
      where: {
        sessionId,
        workspaceId: workspace.id,
        userId: user.id,
      },
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[AI/ASK DELETE]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to clear history" }, { status: 500 });
  }
}
