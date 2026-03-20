import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/currentUser";
import { getDbUser, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/workspaces
 * List all workspaces the current user is a member of.
 */
export async function GET() {
  try {
    const user = await getDbUser();

    const memberships = await db.workspaceMember.findMany({
      where: { userId: user.id },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            ownerId: true,
            createdAt: true,
            _count: {
              select: {
                members: true,
                projects: true,
              },
            },
          },
        },
        role: true,
      },
      orderBy: { joinedAt: "desc" },
    });

    const workspaces = memberships.map((m) => ({
      ...m.workspace,
      role: m.role?.name ?? "MEMBER",
      isOwner: m.workspace.ownerId === user.id,
      memberCount: m.workspace._count.members,
      projectCount: m.workspace._count.projects,
    }));

    return Response.json(workspaces);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/workspaces
 * Create a new workspace. The current user becomes the owner and first member.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getDbUser();
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      throw new ApiError(400, "Name and slug are required");
    }

    // Check slug uniqueness
    const existing = await db.workspace.findUnique({ where: { slug } });
    if (existing) {
      throw new ApiError(409, "A workspace with this slug already exists");
    }

    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
          },
        },
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

    return Response.json(workspace, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
