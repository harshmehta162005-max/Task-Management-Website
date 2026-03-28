import { NextRequest } from "next/server";
import { db } from "@/lib/db/prisma";
import { runAutomations } from "@/lib/automations/engine";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/automations
 * Intended to be hit hourly or daily by a service like Vercel Cron.
 * It checks all running tasks for time-based triggers (Due soon, Stale)
 * and processes weekly summaries.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Basic security for cron endpoints
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET;
    
    // Only enforce secret in production if it is set
    if (process.env.NODE_ENV === "production" && secret) {
      if (authHeader !== `Bearer ${secret}`) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const now = new Date();
    
    // Process Workspaces for Weekly Summaries
    if (now.getDay() === 5) { // Friday (Day 5)
      const workspaces = await db.workspace.findMany();
      for (const ws of workspaces) {
        const projects = await db.project.findMany({ where: { workspaceId: ws.id } });
        for (const proj of projects) {
          // Send a weekly trigger mock task
          await runAutomations("weekly_schedule", { id: "weekly", title: `Weekly Summary` }, proj, ws);
        }
      }
    }

    // Process all pending tasks in the database for Due and Stale conditions
    const pendingTasks = await db.task.findMany({
      where: { 
        status: { notIn: ["DONE", "CANCELLED"] },
      },
      include: { 
        project: { 
          include: { workspace: true } 
        } 
      }
    });

    let dueCount = 0;
    let staleCount = 0;

    for (const task of pendingTasks) {
      const msSinceUpdate = now.getTime() - task.updatedAt.getTime();
      const daysSinceUpdate = Math.floor(msSinceUpdate / (1000 * 3600 * 24));
      
      // Pass the computed days to the engine to evaluate
      await runAutomations("no_update_x_days", { ...task, _daysSinceUpdate: daysSinceUpdate }, task.project, task.project.workspace);
      staleCount++;

      if (task.dueDate) {
        // Calculate days difference (ignoring time-of-day by strict math or using ms diff)
        const msDiff = task.dueDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(msDiff / (1000 * 3600 * 24));
        
        await runAutomations("due_date_approaching", { ...task, _daysDiff: daysDiff }, task.project, task.project.workspace);
        dueCount++;
      }
    }

    return Response.json({
      success: true,
      processed: {
        totalPendingTasks: pendingTasks.length,
        dueChecks: dueCount,
        staleChecks: staleCount,
      }
    });
    
  } catch (error: any) {
    console.error("Cron automation error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
