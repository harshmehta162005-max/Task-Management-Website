import { db } from "@/lib/db/prisma";
import { resolveWorkspace } from "@/lib/workspace/resolveWorkspace";

type RouteContext = { params: Promise<{ sessionId: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { sessionId } = await context.params;
    const body = await req.json();
    const { name, workspaceSlug } = body as { name: string; workspaceSlug: string };

    if (!name?.trim() || !workspaceSlug) {
      return Response.json({ error: "name and workspaceSlug are required" }, { status: 400 });
    }

    const { user } = await resolveWorkspace(workspaceSlug);

    // Ensure user owns this session
    const session = await db.aiChatSession.findFirst({
      where: { id: sessionId, userId: user.id },
    });
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    const updated = await db.aiChatSession.update({
      where: { id: sessionId },
      data: { name: name.trim() },
      select: { id: true, name: true },
    });

    return Response.json({ session: updated });
  } catch (err) {
    console.error("[AI/SESSIONS PATCH]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to rename session" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { sessionId } = await context.params;
    const url = new URL(req.url);
    const workspaceSlug = url.searchParams.get("workspaceSlug");

    if (!workspaceSlug) {
      return Response.json({ error: "workspaceSlug required" }, { status: 400 });
    }

    const { user } = await resolveWorkspace(workspaceSlug);

    // Ensure user owns this session
    const session = await db.aiChatSession.findFirst({
      where: { id: sessionId, userId: user.id },
    });
    if (!session) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    // Delete session — cascades to messages
    await db.aiChatSession.delete({ where: { id: sessionId } });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[AI/SESSIONS DELETE]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
