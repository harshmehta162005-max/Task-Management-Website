import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ workspaceId: string }> };

/**
 * GET /api/workspaces/[workspaceId]/members
 * List all members and pending invites.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { workspaceId } = await params;
    const slug = req.nextUrl.searchParams.get("slug") || workspaceId;
    const { workspace } = await resolveWorkspace(slug);

    const members = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        role: { select: { name: true } },
      },
      orderBy: { joinedAt: "asc" },
    });

    const invites = await db.workspaceInvite.findMany({
      where: { workspaceId: workspace.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      members: members.map((m) => ({
        id: m.user.id,
        name: m.user.name ?? m.user.email,
        email: m.user.email,
        role: m.role?.name ?? "MEMBER",
        status: "ACTIVE",
        joinedAt: m.joinedAt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        avatarUrl: m.user.avatarUrl,
      })),
      invites: invites.map((i) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        invitedAt: formatTimeAgo(i.createdAt),
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const hours = Math.round(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.round(hours / 24)} days ago`;
}
