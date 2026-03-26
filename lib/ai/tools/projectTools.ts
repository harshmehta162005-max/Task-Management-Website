import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db/prisma";
import { subDays } from "date-fns";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Fetches the last 7 days of project data and generates a prose weekly summary.
 */
export async function generateWeeklySummary(projectId: string): Promise<string> {
  const since = subDays(new Date(), 7);

  // Fetch project
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { name: true, description: true },
  });
  if (!project) throw new Error("Project not found");

  // Fetch tasks this week
  const allTasks = await db.task.findMany({
    where: { projectId },
    select: {
      title: true,
      status: true,
      priority: true,
      updatedAt: true,
      assignees: { select: { user: { select: { name: true } } } },
    },
  });

  const completedThisWeek = allTasks.filter(
    (t) => t.status === "DONE" && t.updatedAt >= since
  );
  const blockers = allTasks.filter((t) => t.status === "BLOCKED");
  const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS");

  const context = `
Project: ${project.name}
${project.description ? `Description: ${project.description}` : ""}

Tasks completed this week (${completedThisWeek.length}):
${completedThisWeek.map((t: { title: string }) => `- ${t.title}`).join("\n") || "- None"}

Currently in progress (${inProgress.length}):
${inProgress.map((t: { title: string; priority: string }) => `- ${t.title} [Priority: ${t.priority}]`).join("\n") || "- None"}

Blockers (${blockers.length}):
${blockers.map((t: { title: string }) => `- ${t.title}`).join("\n") || "- None"}
  `.trim();

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Write a concise, professional weekly summary for a project manager based on this data. 
Be specific about numbers and highlight risks. Keep it to 3-4 sentences maximum.

${context}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
