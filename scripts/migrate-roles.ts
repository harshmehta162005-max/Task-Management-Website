import { db } from "../lib/db/prisma";

const DEFAULT_SYSTEM_ROLES = [
  {
    name: "Owner",
    isSystem: true,
    permissions: [
      "project.create", "project.edit", "project.archive", "project.delete", "project.view",
      "task.create", "task.edit", "task.assign", "task.move", "task.delete", "task.comment",
      "members.invite", "members.roles", "members.remove",
      "settings.profile", "settings.tags", "settings.notifications", "settings.roles", "settings.delete",
      "notes.create", "notes.view", "notes.delete",
      "ai.workspace", "ai.project"
    ]
  },
  {
    name: "Admin",
    isSystem: true,
    permissions: [
      "project.create", "project.edit", "project.archive", "project.delete", "project.view",
      "task.create", "task.edit", "task.assign", "task.move", "task.delete", "task.comment",
      "members.invite", "members.roles", "members.remove",
      "settings.profile", "settings.tags", "settings.notifications", "settings.roles",
      "notes.create", "notes.view", "notes.delete",
      "ai.workspace", "ai.project"
    ]
  },
  {
    name: "Manager",
    isSystem: true,
    permissions: [
      "project.create", "project.edit", "project.archive", "project.view",
      "task.create", "task.edit", "task.assign", "task.move", "task.delete", "task.comment",
      "members.invite", "members.remove",
      "settings.profile", "settings.tags", "settings.notifications",
      "notes.create", "notes.view", "notes.delete",
      "ai.workspace", "ai.project"
    ]
  },
  {
    name: "Member",
    isSystem: true,
    permissions: [
      "project.view",
      "task.create", "task.edit", "task.assign", "task.move", "task.comment",
      "notes.create", "notes.view",
      "ai.project"
    ]
  }
];

async function main() {
  console.log("Starting roles migration...");
  let workspacesProcessed = 0;
  let rolesCreated = 0;
  let membersUpdated = 0;

  const workspaces = await db.workspace.findMany();

  for (const workspace of workspaces) {
    console.log(`\nProcessing Workspace: ${workspace.name} (${workspace.id})`);

    // 1. Seed system roles if they don't exist
    const workspaceRoles = await db.role.findMany({
      where: { workspaceId: workspace.id, isSystem: true },
    });

    const roleMap: Record<string, string> = {};

    for (const sysRole of DEFAULT_SYSTEM_ROLES) {
      const existing = workspaceRoles.find((r) => r.name === sysRole.name);
      if (!existing) {
        const created = await db.role.create({
          data: {
            workspaceId: workspace.id,
            name: sysRole.name,
            isSystem: sysRole.isSystem,
            permissions: sysRole.permissions,
          },
        });
        roleMap[created.name] = created.id;
        rolesCreated++;
        console.log(`Created system role: ${created.name}`);
      } else {
        roleMap[existing.name] = existing.id;
      }
    }

    // 2. Assign Member role to any user who doesn't have a role
    const membersWithoutRole = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id, roleId: null },
    });

    if (membersWithoutRole.length > 0) {
      for (const member of membersWithoutRole) {
        // Special case: if this user is the workspace owner, assign the "Owner" role
        const targetRoleId = member.userId === workspace.ownerId ? roleMap["Owner"] : roleMap["Member"];

        await db.workspaceMember.update({
          where: { id: member.id },
          data: { roleId: targetRoleId },
        });
        membersUpdated++;
      }
      console.log(`Assigned roles to ${membersWithoutRole.length} members.`);
    }

    workspacesProcessed++;
  }

  console.log("\n--- Migration Complete ---");
  console.log(`Workspaces processed: ${workspacesProcessed}`);
  console.log(`Roles created: ${rolesCreated}`);
  console.log(`Members updated: ${membersUpdated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
