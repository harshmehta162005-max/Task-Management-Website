import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { P_SETTINGS_TAGS } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string; tagId: string }> };

/**
 * PATCH /api/workspaces/[workspaceId]/tags/[tagId]
 * Edit tag name/color. Requires settings.tags permission.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId, tagId } = await params;
    const body = await req.json();
    const { name, color, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");

    await checkPermission(workspaceSlug, P_SETTINGS_TAGS);

    // Verify tag exists in this workspace
    const existing = await db.tag.findFirst({
      where: { id: tagId, workspaceId },
    });
    if (!existing) throw new ApiError(404, "Tag not found");

    // Case-insensitive duplicate check on rename
    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const dup = await db.tag.findFirst({
        where: {
          workspaceId,
          name: { equals: name.trim(), mode: "insensitive" },
          id: { not: tagId },
        },
      });
      if (dup) {
        throw new ApiError(409, `Tag "${name.trim()}" already exists`);
      }
    }

    const updated = await db.tag.update({
      where: { id: tagId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(color !== undefined && { color }),
      },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    return Response.json({
      id: updated.id,
      name: updated.name,
      color: updated.color,
      usageCount: updated._count.tasks,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/workspaces/[workspaceId]/tags/[tagId]
 * Delete a tag. Cascade removes all task_tags entries.
 * Requires settings.tags permission.
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId, tagId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    await checkPermission(slug, P_SETTINGS_TAGS);

    // Verify tag exists in this workspace
    const existing = await db.tag.findFirst({
      where: { id: tagId, workspaceId },
    });
    if (!existing) throw new ApiError(404, "Tag not found");

    // Delete tag — TaskTag entries cascade automatically
    await db.tag.delete({ where: { id: tagId } });

    return Response.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
