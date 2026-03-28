import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { P_SETTINGS_PROFILE, P_SETTINGS_DELETE } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string }> };

/**
 * GET /api/workspaces/[workspaceId]
 * The workspaceId param can be either the DB id or the slug.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;

    // Use resolveWorkspace which returns isAdmin/isOwner
    const { workspace, isAdmin, isOwner } = await resolveWorkspace(workspaceId);

    const counts = await db.workspace.findUnique({
      where: { id: workspace.id },
      select: { _count: { select: { members: true, projects: true } } },
    });

    return Response.json({
      ...workspace,
      isAdmin,
      isOwner,
      memberCount: counts?._count.members ?? 0,
      projectCount: counts?._count.projects ?? 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/workspaces/[workspaceId]
 * Update workspace profile (name, slug, logoUrl). Requires admin/owner.
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const ctx = await checkPermission(workspaceId, P_SETTINGS_PROFILE);
    const workspace = ctx.workspace;

    const body = await req.json();
    const { name, slug, logoUrl } = body;

    // If slug is changing, check uniqueness
    if (slug && slug !== workspace.slug) {
      const existing = await db.workspace.findUnique({ where: { slug } });
      if (existing) {
        throw new ApiError(409, "A workspace with this slug already exists");
      }
    }

    const updated = await db.workspace.update({
      where: { id: workspace.id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(logoUrl !== undefined && { logoUrl }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        ownerId: true,
        createdAt: true,
      },
    });

    return Response.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/workspaces/[workspaceId]
 * Delete workspace. Requires owner.
 */
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const ctx = await checkPermission(workspaceId, P_SETTINGS_DELETE);
    const workspace = ctx.workspace;

    await db.workspace.delete({ where: { id: workspace.id } });

    return Response.json({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
