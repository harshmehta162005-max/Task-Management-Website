import { db } from "./lib/db/prisma";

async function main() {
  const p = await db.project.findFirst({
    where: { name: "ProjectTest" },
    include: { tasks: true }
  });
  console.log("ProjectTest tasks:", p?.tasks);
}

main();
