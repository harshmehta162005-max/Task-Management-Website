import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { resolveWorkspace, handleApiError } from "@/lib/workspace/resolveWorkspace";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const { workspace, user } = await resolveWorkspace(workspaceId);

    // 1. Get the current workspace role for this user
    const currentMember = await db.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
      include: { role: true },
    });

    const currentRole = workspace.ownerId === user.id ? "Owner" : (currentMember?.role?.name || "Member");

    // 2. Workspaces Enrolled
    const allMemberships = await db.workspaceMember.findMany({
      where: { userId: user.id },
      include: {
        workspace: {
            // Count projects without nested selection, which simpler:
        },
        role: true,
      },
      orderBy: { joinedAt: "desc" },
    });

    // Query all projects the user is a member of:
    const allUserProjects = await db.projectMember.findMany({
      where: { userId: user.id },
      include: { project: { select: { workspaceId: true } } }
    });
    
    // Create a map: workspaceId -> total project memberships for this user
    const workspaceProjectCounts: Record<string, number> = {};
    for (const pm of allUserProjects) {
      const wId = pm.project.workspaceId;
      workspaceProjectCounts[wId] = (workspaceProjectCounts[wId] || 0) + 1;
    }

    const workspaces = allMemberships.map(m => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      logoUrl: m.workspace.logoUrl,
      role: m.workspace.ownerId === user.id ? "Owner" : (m.role?.name || "Member"),
      memberProjectCount: workspaceProjectCounts[m.workspace.id] || 0,
    }));

    // 3. Projects Enrolled in CURRENT workspace
    // First find the project IDs in this workspace:
    const currentWorkspaceProjectsList = await db.project.findMany({
      where: { workspaceId: workspace.id }, select: { id: true }
    });

    // Then find memberships:
    const currentWorkspaceProjects = await db.projectMember.findMany({
      where: { 
        userId: user.id, 
        projectId: { in: currentWorkspaceProjectsList.map(p => p.id) } 
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                tasks: {
                  where: { assignees: { some: { userId: user.id } } }
                }
              }
            }
          }
        }
      },
      orderBy: { joinedAt: "desc" }
    });

    const projects = currentWorkspaceProjects.map(pm => ({
      id: pm.project.id,
      name: pm.project.name,
      role: pm.role,
      taskCount: pm.project._count.tasks
    }));

    // 4. Tasks Snapshot in CURRENT workspace
    const tasks = await db.taskAssignee.findMany({
      where: {
        userId: user.id,
        task: { projectId: { in: currentWorkspaceProjects.map(p => p.projectId) } }
      },
      include: {
        task: {
          select: { status: true, dueDate: true }
        }
      }
    });

    let todoCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let overdueCount = 0;

    const now = new Date();

    for (const a of tasks) {
      if (a.workStatus === "TODO") todoCount++;
      if (a.workStatus === "IN_PROGRESS") inProgressCount++;
      if (a.workStatus === "SUBMITTED" || a.task.status === "DONE") completedCount++;
      
      if (a.task.dueDate && new Date(a.task.dueDate) < now && a.workStatus !== "SUBMITTED" && a.task.status !== "DONE") {
        overdueCount++;
      }
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        workspaceRole: currentRole,
      },
      workspaces,
      projects,
      taskSnapshot: {
        todo: todoCount,
        inProgress: inProgressCount,
        completed: completedCount,
        overdue: overdueCount,
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}
