import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { checkPermission } from "@/lib/rbac/checkPermission";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { P_SETTINGS_ROLES } from "@/lib/rbac/permissions";

/**
 * GET /api/workspaces/[workspaceId]/roles
 * List all roles for the workspace.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId: slug } = await params;
    if (!slug) throw new ApiError(400, "Workspace slug is required");

    // Any workspace member can view roles (uses resolveWorkspace internally)
    const { resolveWorkspace } = await import("@/lib/workspace/resolveWorkspace");
    const { workspace } = await resolveWorkspace(slug);

    const roles = await db.role.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { members: true } },
      },
    });

    return Response.json(
      roles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        permissions: r.permissions,
        isSystem: r.isSystem,
        memberCount: r._count.members,
        createdAt: r.createdAt,
      }))
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/workspaces/[workspaceId]/roles
 * Create a new custom role.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId: slug } = await params;
    if (!slug) throw new ApiError(400, "Workspace slug is required");

    const ctx = await checkPermission(slug, P_SETTINGS_ROLES);
    const body = await req.json();
    const { name, description, permissions, cloneFrom } = body;

    if (!name) throw new ApiError(400, "Role name is required");

    // If cloning, get source permissions
    let perms = permissions ?? [];
    if (cloneFrom) {
      const source = await db.role.findUnique({
        where: { id: cloneFrom },
        select: { permissions: true },
      });
      if (source) perms = source.permissions;
    }

    const role = await db.role.create({
      data: {
        name,
        description,
        workspaceId: ctx.workspace.id,
        isSystem: false,
        permissions: perms,
      },
    });

    return Response.json(role, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
