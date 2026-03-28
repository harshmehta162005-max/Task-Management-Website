import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError, ApiError } from "@/lib/workspace/resolveWorkspace";

/**
 * GET /api/projects?workspaceSlug=xxx
 * List projects for a workspace with task counts.
 */
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("workspaceSlug");
    if (!slug) throw new ApiError(400, "workspaceSlug is required");

    const { workspace } = await resolveWorkspace(slug);

    const projects = await db.project.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "desc" },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    // Get task counts per status for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const statusCounts = await db.task.groupBy({
          by: ["status"],
          where: { projectId: p.id },
          _count: true,
        });

        const countMap: Record<string, number> = {};
        statusCounts.forEach((s) => {
          countMap[s.status] = s._count;
        });

        return {
          id: p.id,
          name: p.name,
          description: p.description ?? "",
          status: p.status.toLowerCase(),
          createdAt: p.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          members: p.members.map((m) => m.user.avatarUrl ?? ""),
          memberDetails: p.members.map((m) => ({
            id: m.user.id,
            name: m.user.name ?? "",
            avatarUrl: m.user.avatarUrl ?? "",
          })),
          totalTasks: p._count.tasks,
          completedTasks: countMap["DONE"] ?? 0,
          blockedTasks: countMap["BLOCKED"] ?? 0,
          overdueTasks: 0, // Will compute below
          icon: "folder_open",
          accentBg: "bg-primary/10",
          accentColor: "text-primary",
        };
      })
    );

    // Compute overdue counts
    const now = new Date();
    for (const p of projectsWithCounts) {
      const overdue = await db.task.count({
        where: {
          projectId: p.id,
          status: { notIn: ["DONE", "CANCELLED"] },
          dueDate: { lt: now },
        },
      });
      p.overdueTasks = overdue;
    }

    return Response.json(projectsWithCounts);
  } catch (error) {
    return handleApiError(error);
  }
}

import { checkPermission } from "@/lib/rbac/checkPermission";
import { P_PROJECT_CREATE } from "@/lib/rbac/permissions";

/**
 * POST /api/projects
 * Create a new project in a workspace.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceSlug, name, description, members: memberIds } = body;

    if (!workspaceSlug) throw new ApiError(400, "workspaceSlug is required");
    if (!name) throw new ApiError(400, "Project name is required");

    const { workspace, user } = await checkPermission(workspaceSlug, P_PROJECT_CREATE);

    const project = await db.project.create({
      data: {
        name,
        description: description || null,
        workspaceId: workspace.id,
        members: {
          create: [
            { userId: user.id, role: "OWNER" },
            ...(memberIds || [])
              .filter((id: string) => id !== user.id)
              .map((userId: string) => ({ userId, role: "MEMBER" })),
          ],
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    return Response.json(
      {
        id: project.id,
        name: project.name,
        description: project.description ?? "",
        status: "active",
        createdAt: project.createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        members: project.members.map((m) => m.user.avatarUrl ?? ""),
        memberDetails: project.members.map((m) => ({
          id: m.user.id,
          name: m.user.name ?? "",
          avatarUrl: m.user.avatarUrl ?? "",
        })),
        totalTasks: 0,
        completedTasks: 0,
        blockedTasks: 0,
        overdueTasks: 0,
        icon: "folder_open",
        accentBg: "bg-primary/10",
        accentColor: "text-primary",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
