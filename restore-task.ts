import { db } from "./lib/db/prisma";

async function main() {
  const p = await db.project.findFirst({
    where: { name: "ProjectTest" },
  });

  if (!p) {
    return console.log("ProjectTest not found.");
  }

  const workspace = await db.workspace.findUnique({
    where: { id: p.workspaceId },
    include: { members: true }
  });

  const owner = workspace?.members[0];
  if (!owner) return console.log("Owner not found");

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const t = await db.task.create({
    data: {
      title: "First Task (Restored)",
      description: "This task was created during onboarding. We restored it and set the due date to today so it appears on your dashboard!",
      projectId: p.id,
      creatorId: owner.userId,
      priority: "HIGH",
      dueDate: today,
      status: "TODO",
      position: 1,
      assignees: {
        create: {
          userId: owner.userId,
        }
      }
    }
  });

  console.log("Restored task:", t.title);
}

main();
