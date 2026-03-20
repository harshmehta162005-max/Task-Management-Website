import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function testPatch() {
  try {
    const task = await db.task.findFirst({
      include: {
        project: true
      }
    });
    if (!task) return console.log("No task found");

    console.log("Testing with task ID:", task.id);

    // Mimic the exact logic that's failing in route.ts
    const taskId = task.id;
    const body = {
      subtasks: [{ id: "123", title: "Test", completed: false }],
      dependencies: { blockedBy: [], blocking: [] },
      attachments: [{ id: "456", name: "test.png", size: "1MB" }]
    };

    const { subtasks, dependencies, attachments } = body;

    console.log("Testing attachments...");
    if (attachments !== undefined && Array.isArray(attachments)) {
      const existingAtt = await db.attachment.findMany({ where: { taskId } });
      const incomingIds = attachments.map((a: any) => a.id);
      
      const toDelete = existingAtt.filter(e => !incomingIds.includes(e.id)).map(e => e.id);
      if (toDelete.length > 0) {
        await db.attachment.deleteMany({ where: { id: { in: toDelete } } });
      }

      for (const a of attachments) {
        const exists = existingAtt.find(e => e.id === a.id);
        if (!exists) {
          await db.attachment.create({
            data: { id: a.id, name: a.name, size: a.size, taskId }
          });
        }
      }
    }

    console.log("Testing dependencies...");
    if (dependencies !== undefined) {
      // Clear existing and recreate
      await db.taskDependency.deleteMany({
        where: { OR: [{ taskId }, { dependsOnId: taskId }] },
      });

      if (dependencies.blockedBy?.length > 0) {
        for (const d of dependencies.blockedBy) {
          await db.taskDependency.create({ data: { taskId, dependsOnId: d.id } });
        }
      }
      if (dependencies.blocking?.length > 0) {
        for (const d of dependencies.blocking) {
          await db.taskDependency.create({ data: { taskId: d.id, dependsOnId: taskId } });
        }
      }
    }

    console.log("Testing subtasks...");
    if (subtasks !== undefined && Array.isArray(subtasks)) {
      const existingSubtasks = await db.task.findMany({ where: { parentId: taskId } });
      const incomingIds = subtasks.map((s: any) => s.id);
      
      const toDelete = existingSubtasks.filter(e => !incomingIds.includes(e.id)).map(e => e.id);
      if (toDelete.length > 0) {
        await db.task.deleteMany({ where: { id: { in: toDelete } } });
      }

      for (const s of subtasks) {
        const subStatus = s.completed ? "DONE" : "TODO";
        const exists = existingSubtasks.find(e => e.id === s.id);
        if (exists) {
          await db.task.update({ where: { id: s.id }, data: { title: s.title, status: subStatus } });
        } else {
          await db.task.create({
            data: {
              id: s.id,
              title: s.title,
              status: subStatus,
              projectId: task.projectId,
              creatorId: task.creatorId,
              parentId: taskId,
              priority: "MEDIUM"
            }
          });
        }
      }
    }

    console.log("Success!");
  } catch(e) {
    console.error("ERROR CAUGHT!");
    console.error(e);
  } finally {
    await db.$disconnect();
  }
}

testPatch();
