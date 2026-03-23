import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/projects/[projectId]/calendar-notes?workspaceSlug=xxx&month=2026-03
 * Returns notes visible to the current user:
 *   - All public notes for this project/month
 *   - All private notes owned by the current user
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const sp = req.nextUrl.searchParams;
    const slug = sp.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { user } = await resolveWorkspace(slug);

    const monthParam = sp.get("month");
    const dateFilter: any = {};
    if (monthParam) {
      const [year, month] = monthParam.split("-").map(Number);
      dateFilter.gte = new Date(Date.UTC(year, month - 1, 1));
      dateFilter.lte = new Date(Date.UTC(year, month, 0));
    }

    const notes = await db.calendarNote.findMany({
      where: {
        projectId,
        ...(monthParam ? { date: dateFilter } : {}),
        OR: [
          { isPublic: true },
          { authorId: user.id },
        ],
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublic: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/projects/[projectId]/calendar-notes
 * Any project member can create a note.
 * Members: always private. Managers/owners: respect isPublic from body.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const body = await req.json();
    const { date, content, workspaceSlug, isPublic } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!date) throw new ApiError(400, "date is required");
    if (!content || (typeof content === "string" && !content.trim())) throw new ApiError(400, "content is required");

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    // Must be a project member
    const membership = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    if (!membership) throw new ApiError(403, "You must be a project member");

    // Members always private; managers/owners can toggle
    const isManagerOrOwner = ["MANAGER", "OWNER"].includes(membership.role) || workspace.ownerId === user.id;
    const noteIsPublic = isManagerOrOwner ? (isPublic === true) : false;

    const dateObj = new Date(date + "T00:00:00.000Z");

    const note = await db.calendarNote.create({
      data: {
        date: dateObj,
        content: typeof content === "string" ? content : JSON.stringify(content),
        isPublic: noteIsPublic,
        projectId,
        authorId: user.id,
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublic: true,
        authorId: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(note);
  } catch (err) {
    return handleApiError(err);
  }
}
