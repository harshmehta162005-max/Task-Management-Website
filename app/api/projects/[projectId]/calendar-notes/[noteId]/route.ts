import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * PATCH /api/projects/[projectId]/calendar-notes/[noteId]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; noteId: string }> }
) {
  try {
    const { projectId, noteId } = await params;
    const body = await req.json();
    const { content, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!content || (typeof content === "string" && !content.trim())) throw new ApiError(400, "content is required");

    const { workspace, user } = await resolveWorkspace(workspaceSlug);

    const isWorkspaceOwner = workspace.ownerId === user.id;
    const membership = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    const isProjectManager = membership && ["MANAGER", "OWNER"].includes(membership.role);
    if (!isWorkspaceOwner && !isProjectManager) {
      throw new ApiError(403, "Only managers and owners can edit notes");
    }

    const note = await db.calendarNote.update({
      where: { id: noteId },
      data: {
        content: typeof content === "string" ? content : JSON.stringify(content),
        authorId: user.id,
      },
      select: {
        id: true,
        date: true,
        content: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json(note);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/projects/[projectId]/calendar-notes/[noteId]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; noteId: string }> }
) {
  try {
    const { projectId, noteId } = await params;
    const sp = req.nextUrl.searchParams;
    const slug = sp.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace, user } = await resolveWorkspace(slug);

    const isWorkspaceOwner = workspace.ownerId === user.id;
    const membership = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    const isProjectManager = membership && ["MANAGER", "OWNER"].includes(membership.role);
    if (!isWorkspaceOwner && !isProjectManager) {
      throw new ApiError(403, "Only managers and owners can delete notes");
    }

    await db.calendarNote.delete({ where: { id: noteId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
