import { db } from "./lib/db/prisma";
import fs from "fs";

async function main() {
  const tasks = await db.task.findMany({
    include: {
      project: true,
      assignees: true,
    }
  });
  fs.writeFileSync("out2.json", JSON.stringify(tasks, null, 2), "utf8");
}

main();
