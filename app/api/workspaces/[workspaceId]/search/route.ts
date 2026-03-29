import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError } from "@/lib/workspace/resolveWorkspace";

type Params = { params: Promise<{ workspaceId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Note: the route parameter might be the slug (e.g. workspaceId) depending on folder structure
    const slug = (await params).workspaceId;
    const { workspace } = await resolveWorkspace(slug);
    
    // Fallback if there is no query string
    const query = req.nextUrl.searchParams.get("q")?.trim() || "";
    
    if (!query) {
      return Response.json({ projects: [], tasks: [], members: [] });
    }

    // 1) Find Projects by Name
    const projects = await db.project.findMany({
      where: {
        workspaceId: workspace.id,
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
      },
      take: 5,
    });

    // 2) Find Tasks by Title
    const tasks = await db.task.findMany({
      where: {
        project: { workspaceId: workspace.id },
        title: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        title: true,
        status: true,
        project: { select: { id: true, name: true } },
      },
      take: 5,
    });

    // 3) Find Members by Name or Email
    const members = await db.workspaceMember.findMany({
      where: {
        workspaceId: workspace.id,
        user: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      },
      select: {
        user: { select: { id: true, name: true, email: true } },
      },
      take: 5,
    });

    return Response.json({
      projects: projects.map((p) => ({ id: p.id, name: p.name })),
      tasks: tasks.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        projectId: t.project.id,
        projectName: t.project.name,
      })),
      members: members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
