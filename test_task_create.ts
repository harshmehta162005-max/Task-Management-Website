import 'dotenv/config'; // loads .env.local
import { db } from './lib/db/prisma';

async function test() {
  const workspaces = await db.workspace.findMany();
  console.log("Found workspaces:", workspaces.length, workspaces.map(w => w.slug));

  if (workspaces.length === 0) {
    console.log("No workspaces found, database might be empty or wrong URL.");
    return;
  }

  const ws = workspaces[0];
  const pj = await db.project.findFirst({where:{workspaceId:ws.id}});
  
  if (!pj) {
    console.log("No projects found in workspace");
    return;
  }

  const usr = await db.user.findFirst();
  if (!usr) {
    console.log("No users found");
    return;
  }

  console.log("Creating task for Project", pj.name);

  const task = await db.task.create({
    data: {
      title: 'Backend Fix Verification',
      projectId: pj.id,
      creatorId: usr.id,
      assignees: { create: { userId: usr.id } },
      subtasks: {
        create: [
          { title: 'Test persistence', status: 'TODO', priority: 'MEDIUM', projectId: pj.id, creatorId: usr.id }
        ]
      },
      attachments: {
        create: [
          { id: 'attach-' + Date.now(), name: 'verification.png', size: '200 KB' }
        ]
      }
    },
    include: { subtasks: true, attachments: true }
  });

  const tag = await db.tag.upsert({
    where: { name_workspaceId: { name: "automated-test", workspaceId: ws.id } },
    update: {},
    create: { name: "automated-test", color: "#6366f1", workspaceId: ws.id },
  });
  await db.taskTag.create({
    data: { taskId: task.id, tagId: tag.id },
  });

  console.log('SUCCESS: Task Created!');
  console.log('Attachments:', task.attachments.length);
  console.log('Subtasks:', task.subtasks.length);
}

test().catch(console.error).finally(() => db.$disconnect());
