import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";
import { checkPermission, resolvePermissions } from "@/lib/rbac/checkPermission";
import { P_SETTINGS_TAGS } from "@/lib/rbac/permissions";

type Params = { params: Promise<{ workspaceId: string }> };

/**
 * GET /api/workspaces/[workspaceId]/tags
 * List all workspace tags with usage count.
 * Any workspace member can read tags.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    // Just resolve permissions (no specific permission required to read tags)
    await resolvePermissions(slug);

    const tags = await db.tag.findMany({
      where: { workspaceId },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { name: "asc" },
    });

    const result = tags.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      usageCount: t._count.tasks,
      createdAt: t.createdAt.toISOString(),
    }));

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/workspaces/[workspaceId]/tags
 * Create a new workspace tag. Requires settings.tags permission.
 */
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const body = await req.json();
    const { name, color, workspaceSlug } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!name?.trim()) throw new ApiError(400, "Tag name is required");

    // Permission check
    await checkPermission(workspaceSlug, P_SETTINGS_TAGS);

    // Case-insensitive duplicate check
    const existing = await db.tag.findFirst({
      where: {
        workspaceId,
        name: { equals: name.trim(), mode: "insensitive" },
      },
    });
    if (existing) {
      throw new ApiError(409, `Tag "${name.trim()}" already exists`);
    }

    const tag = await db.tag.create({
      data: {
        name: name.trim(),
        color: color || "#6366f1",
        workspaceId,
      },
    });

    return Response.json(
      {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        usageCount: 0,
        createdAt: tag.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
