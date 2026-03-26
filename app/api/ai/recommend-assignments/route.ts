import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { workspaceId, taskId } = body as {
      workspaceId: string;
      taskId?: string;
    };

    if (!workspaceId) {
      return Response.json({ error: "workspaceId is required" }, { status: 400 });
    }

    // Get all workspace members with their active task counts
    const members = await db.workspaceMember.findMany({
      where: { workspaceId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            taskAssignments: {
              where: {
                task: {
                  status: { notIn: ["DONE", "CANCELLED"] },
                  project: { workspaceId },
                },
              },
              select: {
                task: {
                  select: { priority: true, status: true },
                },
              },
            },
          },
        },
      },
    });

    // Calculate workload scores
    const workloadData = members.map((m) => {
      const tasks = m.user.taskAssignments;
      const score =
        tasks.reduce((acc, t) => {
          const weights: Record<string, number> = {
            URGENT: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
          };
          return acc + (weights[t.task.priority] ?? 1);
        }, 0);
      return {
        id: m.user.id,
        name: m.user.name ?? m.user.email,
        activeTasks: tasks.length,
        workloadScore: score,
      };
    });

    // Get the task details if provided
    let taskContext = "";
    if (taskId) {
      const task = await db.task.findUnique({
        where: { id: taskId },
        select: { title: true, priority: true, description: true },
      });
      if (task) {
        taskContext = `\nTask to assign: "${task.title}" | Priority: ${task.priority}${task.description ? `\nDescription: ${task.description}` : ""}`;
      }
    }

    const contextLines = workloadData.map(
      (m) =>
        `- ${m.name}: ${m.activeTasks} active tasks, weighted workload score: ${m.workloadScore}`
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are helping a project manager assign a task to the best team member.
${taskContext}

Current team workload (lower score = more available):
${contextLines.join("\n")}

Recommend the TOP 3 best people to assign this task to, and briefly explain why (1 sentence each).
Format your response as a numbered list: "1. Name - reason"`;

    const result = await model.generateContent(prompt);
    const recommendation = result.response.text();

    return Response.json({
      recommendations: recommendation,
      workload: workloadData,
    });
  } catch (err) {
    console.error("[AI/RECOMMEND-ASSIGNMENTS]", err);
    return Response.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}
