import { db } from "./lib/db/prisma";

async function run() {
  try {
    const activities = await db.activity.findMany({
      where: {
        action: { startsWith: "commented on" },
      },
    });

    let count = 0;
    for (const activity of activities) {
      if (activity.entityType === "TASK" && activity.entityId) {
        const task = await db.task.findUnique({
          where: { id: activity.entityId },
          select: { title: true },
        });

        if (task) {
          await db.activity.update({
            where: { id: activity.id },
            data: {
              action: `commented on "${task.title}"`,
            },
          });
          count++;
        }
      }
    }
    console.log(`Updated ${count} activity logs.`);
  } catch (error) {
    console.error("Error migrating activities:", error);
  } finally {
    process.exit(0);
  }
}

run();
