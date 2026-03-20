import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL
  });
  const db = new PrismaClient({ adapter });

  console.log("Connected to Prisma.");
  try {
    const user = await db.user.findFirst();
    const project = await db.project.findFirst();

    if (!user || !project) {
      console.log("No user or project found to test with.");
      return;
    }

    console.log("Testing db.task.create...");
    const maxPos = await db.task.aggregate({
      where: { projectId: project.id },
      _max: { position: true },
    });

    const task = await db.task.create({
      data: {
        title: "Test Task",
        description: null,
        status: "TODO",
        priority: "MEDIUM",
        dueDate: null,
        position: (maxPos._max.position || 0) + 1,
        projectId: project.id,
        creatorId: user.id,
        assignees: { create: { userId: user.id } },
      },
      include: {
        project: { select: { id: true, name: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    });

    console.log("Created successfully!", task.id);
  } catch (e) {
    console.error("PRISMA ERROR CAUGHT:");
    console.error(e);
  } finally {
    await db.$disconnect();
  }
}

main().catch(console.error);
