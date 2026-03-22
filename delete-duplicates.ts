import { db } from "./lib/db/prisma";

async function main() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "asc" }
  });

  const seen = new Set<string>();
  const toDelete: string[] = [];

  for (const p of projects) {
    const key = `${p.workspaceId}-${p.name}`;
    if (seen.has(key)) {
      toDelete.push(p.id);
    } else {
      seen.add(key);
    }
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate projects...`);
    await db.project.deleteMany({
      where: { id: { in: toDelete } }
    });
    console.log("Deleted duplicates reliably.");
  } else {
    console.log("No duplicates found in the database.");
  }
}

main();
