import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { checkProjectMember } from "@/lib/rbac/checkProjectMember";
import { P_NOTES_CREATE, P_NOTES_DELETE } from "@/lib/rbac/permissions";

/**
 * PATCH /api/projects/[projectId]/calendar-notes/[noteId]
 * Only the note's author can edit their own note.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; noteId: string }> }
) {
  try {
    const { projectId, noteId } = await params;
    const body = await req.json();
    const { content, workspaceSlug, isPublic } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!content || (typeof content === "string" && !content.trim())) throw new ApiError(400, "content is required");

    // Using P_NOTES_CREATE as the benchmark to edit notes, since notes are generally meant
    // to be lightweight. Alternatively, since you can only edit your own notes, we just need basic access.
    const ctx = await checkPermission(workspaceSlug, P_NOTES_CREATE);
    if (!ctx.isOwner) {
      await checkProjectMember(ctx.user.id, projectId);
    }
    const { workspace, user } = ctx;

    // Verify note exists and user is the author
    const existing = await db.calendarNote.findUnique({ where: { id: noteId } });
    if (!existing || existing.projectId !== projectId) throw new ApiError(404, "Note not found");
    if (existing.authorId !== user.id) throw new ApiError(403, "You can only edit your own notes");

    // Members always private; managers/owners can toggle
    const membership = await db.projectMember.findUnique({
      where: { userId_projectId: { userId: user.id, projectId } },
    });
    const isManagerOrOwner = (membership && ["MANAGER", "OWNER"].includes(membership.role)) || workspace.ownerId === user.id;
    const noteIsPublic = isManagerOrOwner ? (isPublic === true) : false;

    const note = await db.calendarNote.update({
      where: { id: noteId },
      data: {
        content: typeof content === "string" ? content : JSON.stringify(content),
        isPublic: noteIsPublic,
      },
      select: {
        id: true,
        date: true,
        content: true,
        isPublic: true,
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
 * Only the note's author can delete their own note.
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

    const ctx = await checkPermission(slug, P_NOTES_DELETE);
    if (!ctx.isOwner) {
      await checkProjectMember(ctx.user.id, projectId);
    }
    const { user } = ctx;

    const existing = await db.calendarNote.findUnique({ where: { id: noteId } });
    if (!existing || existing.projectId !== projectId) throw new ApiError(404, "Note not found");
    if (existing.authorId !== user.id) throw new ApiError(403, "You can only delete your own notes");

    await db.calendarNote.delete({ where: { id: noteId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
