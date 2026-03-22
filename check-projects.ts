import { db } from "./lib/db/prisma";
import fs from "fs";

async function main() {
  const projects = await db.project.findMany();
  fs.writeFileSync("out_projects.json", JSON.stringify(projects, null, 2), "utf8");
}

main();
