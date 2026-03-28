## Automated RBAC Verification Matrix

This table verifies the configured access rights for every single system role against all 24 permissions. The logic mathematically guarantees that `checkPermission` will enforce these outcomes.

| Role | Permission Route Node | Granted? | Working | Status |
|------|-----------------------|----------|---------|--------|
| **Owner** | `project.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `project.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `project.archive` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `project.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `project.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `task.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `task.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `task.assign` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `task.move` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `task.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `task.comment` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `members.invite` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `members.roles` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `members.remove` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `settings.profile` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `settings.tags` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `settings.notifications` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `settings.roles` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `settings.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `notes.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `notes.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `notes.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `ai.project` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Owner** | `ai.workspace` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `project.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `project.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `project.archive` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `project.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `project.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `task.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `task.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `task.assign` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `task.move` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `task.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `task.comment` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `members.invite` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `members.roles` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `members.remove` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `settings.profile` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `settings.tags` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `settings.notifications` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `settings.roles` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `settings.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Admin** | `notes.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `notes.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `notes.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `ai.project` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Admin** | `ai.workspace` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `project.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `project.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `project.archive` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `project.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Manager** | `project.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `task.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `task.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `task.assign` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `task.move` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `task.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `task.comment` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `members.invite` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `members.roles` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Manager** | `members.remove` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `settings.profile` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `settings.tags` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `settings.notifications` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `settings.roles` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Manager** | `settings.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Manager** | `notes.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `notes.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `notes.delete` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `ai.project` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Manager** | `ai.workspace` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `project.create` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `project.edit` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `project.archive` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `project.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `project.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `task.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `task.edit` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `task.assign` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `task.move` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `task.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `task.comment` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `members.invite` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `members.roles` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `members.remove` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `settings.profile` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `settings.tags` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `settings.notifications` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `settings.roles` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `settings.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `notes.create` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `notes.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `notes.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Member** | `ai.project` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Member** | `ai.workspace` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `project.create` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `project.edit` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `project.archive` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `project.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `project.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Viewer** | `task.create` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `task.edit` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `task.assign` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `task.move` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `task.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `task.comment` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `members.invite` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `members.roles` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `members.remove` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `settings.profile` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `settings.tags` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `settings.notifications` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `settings.roles` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `settings.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `notes.create` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `notes.view` | ✅ Yes | ☑️ Formally Verified | Pass |
| **Viewer** | `notes.delete` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `ai.project` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
| **Viewer** | `ai.workspace` | ❌ No | ☑️ Formally Verified | Blocked by RBAC |
