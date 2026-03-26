import { db } from "@/lib/db/prisma";
import { resolveWorkspace } from "@/lib/workspace/resolveWorkspace";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const workspaceSlug = url.searchParams.get("workspaceSlug");
    const mode = url.searchParams.get("mode") ?? "personal";
    const projectId = url.searchParams.get("projectId");

    if (!workspaceSlug) {
      return Response.json({ error: "workspaceSlug required" }, { status: 400 });
    }

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    const sessions = await db.aiChatSession.findMany({
      where: {
        workspaceId: workspace.id,
        userId: user.id,
        mode,
        ...(mode === "project" && projectId ? { projectId } : {}),
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        mode: true,
        projectId: true,
        updatedAt: true,
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, role: true },
        },
      },
    });

    const formatted = sessions.map((s) => ({
      id: s.id,
      name: s.name,
      mode: s.mode,
      projectId: s.projectId,
      updatedAt: s.updatedAt,
      messageCount: s._count.messages,
      lastMessage: s.messages[0]?.content?.slice(0, 80) ?? null,
      lastRole: s.messages[0]?.role ?? null,
    }));

    return Response.json({ sessions: formatted });
  } catch (err) {
    console.error("[AI/SESSIONS GET]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workspaceSlug, name, mode = "personal", projectId } = body as {
      workspaceSlug: string;
      name: string;
      mode?: string;
      projectId?: string;
    };

    if (!workspaceSlug || !name?.trim()) {
      return Response.json({ error: "workspaceSlug and name are required" }, { status: 400 });
    }

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    const session = await db.aiChatSession.create({
      data: {
        name: name.trim(),
        mode,
        workspaceId: workspace.id,
        userId: user.id,
        projectId: mode === "project" ? (projectId ?? null) : null,
      },
      select: {
        id: true,
        name: true,
        mode: true,
        projectId: true,
        updatedAt: true,
      },
    });

    return Response.json({ session });
  } catch (err) {
    console.error("[AI/SESSIONS POST]", err instanceof Error ? err.message : String(err));
    return Response.json({ error: "Failed to create session" }, { status: 500 });
  }
}
