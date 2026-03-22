import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/projects/[projectId]/calendar-notes?workspaceSlug=xxx&month=2026-03
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const sp = req.nextUrl.searchParams;
    const slug = sp.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    await resolveWorkspace(slug);

    const monthParam = sp.get("month");
    const where: any = { projectId };

    if (monthParam) {
      const [year, month] = monthParam.split("-").map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1));
      const end = new Date(Date.UTC(year, month, 0));
      where.date = { gte: start, lte: end };
    }

    const notes = await db.calendarNote.findMany({
      where,
      select: {
        id: true,
        date: true,
        content: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(notes);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/projects/[projectId]/calendar-notes
 * Create or upsert a note on a specific date. Manager/Owner only.
 * Body: { date: "2026-03-15", content: "...", workspaceSlug: "..." }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const { date, content, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!date) throw new ApiError(400, "date is required");
    if (!content || (typeof content === "string" && !content.trim())) throw new ApiError(400, "content is required");

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    // Permission: workspace owner OR project MANAGER/OWNER
    const isWorkspaceOwner = workspace.ownerId === user.id;
    const membership = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    const isProjectManager = membership && ["MANAGER", "OWNER"].includes(membership.role);
    if (!isWorkspaceOwner && !isProjectManager) {
      throw new ApiError(403, "Only managers and owners can create notes");
    }

    const dateObj = new Date(date + "T00:00:00.000Z");

    const note = await db.calendarNote.upsert({
      where: { projectId_date: { projectId, date: dateObj } },
      create: {
        date: dateObj,
        content: typeof content === "string" ? content : JSON.stringify(content),
        projectId,
        authorId: user.id,
      },
      update: {
        content: typeof content === "string" ? content : JSON.stringify(content),
        authorId: user.id,
      },
      select: {
        id: true,
        date: true,
        content: true,
        authorId: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(note);
  } catch (err) {
    return handleApiError(err);
  }
}
