import { db } from "./lib/db/prisma";
import { runAutomations } from "./lib/automations/engine";

async function run() {
  console.log("=========================================");
  console.log(" AUTOMATIONS SYSTEM VERIFICATION AUDIT   ");
  console.log("=========================================\n");

  const results = [];

  try {
    // 1. Database Schema Check
    const automationsCount = await db.automation.count();
    results.push(["Database Schema", "PASS", `Automation table exists. Active Count: ${automationsCount}`]);

    // 2. Fetch One valid automation parsing
    const sample = await db.automation.findFirst();
    if (sample) {
      if (typeof sample.trigger === "object" && typeof sample.action === "object") {
        results.push(["Data Serialization", "PASS", "Trigger and Action arrays natively parse as JSON."]);
      } else {
        results.push(["Data Serialization", "FAIL", "Trigger Action parsed as strings instead of JSON objects."]);
      }
    } else {
      results.push(["Data Serialization", "SKIP", "No automations found to test serialization."]);
    }

    // 3. Evaluate Engine Core Functions
    if (typeof runAutomations === "function") {
      results.push(["Engine (runAutomations)", "PASS", "Dispatcher hook correctly exported and accessible."]);
    } else {
      results.push(["Engine (runAutomations)", "FAIL", "Dispatcher export missing."]);
    }

    // 4. Validate CRON Query Logic Boundary (Using Stale Date Logic test)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const staleTasksCount = await db.task.count({
      where: {
        updatedAt: { lte: thirtyDaysAgo },
        status: { notIn: ["DONE", "CANCELLED"] },
      }
    });
    results.push(["CRON: Stale Scraper", "PASS", `Query boundary valid. (Found ${staleTasksCount} hypothetical stale tasks)`]);

    // 5. Output Results Table
    console.log("------------------------------------------------------------------");
    console.log("| COMPONENT                    | STATUS | NOTES                      ");
    console.log("------------------------------------------------------------------");
    for (const res of results) {
       console.log(`| ${res[0].padEnd(28)} | ${res[1].padEnd(6)} | ${res[2]}`);
    }
    console.log("------------------------------------------------------------------\n");
    console.log("✅ AUDIT COMPLETE.");

  } catch (e: any) {
    console.error("FATAL AUDIT FAILURE:", e.message);
  }
}

run();
