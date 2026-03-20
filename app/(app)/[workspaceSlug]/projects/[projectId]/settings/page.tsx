"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ProjectSettingsHeader } from "@/components/projects/project-settings/ProjectSettingsHeader";
import { ProjectDetailsCard } from "@/components/projects/project-settings/ProjectDetailsCard";
import {
  ProjectMembersCard,
  ProjectMember,
} from "@/components/projects/project-settings/ProjectMembersCard";
import { ProjectVisibilityCard } from "@/components/projects/project-settings/ProjectVisibilityCard";
import { ArchiveProjectCard } from "@/components/projects/project-settings/ArchiveProjectCard";
import { DeleteProjectCard } from "@/components/projects/project-settings/DeleteProjectCard";
import { ConfirmArchiveDialog } from "@/components/projects/project-settings/ConfirmArchiveDialog";
import { ConfirmDeleteProjectDialog } from "@/components/projects/project-settings/ConfirmDeleteProjectDialog";
import { ProjectSettingsNotFound } from "@/components/projects/project-settings/ProjectSettingsNotFound";

const WORKSPACE_MEMBERS = [
  { id: "u1", name: "Alex Rivera", email: "alex@teamos.com" },
  { id: "u2", name: "Sarah Chen", email: "sarah@teamos.com" },
  { id: "u3", name: "Marcus Wright", email: "marcus@teamos.com" },
  { id: "u4", name: "Elena Rodriguez", email: "elena@teamos.com" },
  { id: "u5", name: "Jordan Smith", email: "jordan@teamos.com" },
];

const INITIAL_PROJECT = {
  id: "p1",
  name: "Mobile App",
  description: "Mobile app redesign focusing on onboarding and activation.",
  visibility: "private" as "private" | "workspace",
  members: [
    { id: "u1", name: "Alex Rivera", email: "alex@teamos.com", role: "Manager" as const },
    { id: "u2", name: "Sarah Chen", email: "sarah@teamos.com", role: "Member" as const },
    { id: "u3", name: "Marcus Wright", email: "marcus@teamos.com", role: "Member" as const },
  ] satisfies ProjectMember[],
};

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string; workspaceSlug: string }>();
  // Simulate not found case if projectId missing
  if (!projectId) return <ProjectSettingsNotFound />;

  const [project, setProject] = useState(INITIAL_PROJECT);
  const [visibility, setVisibility] = useState<"private" | "workspace">(project.visibility);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const isManager = true;

  const canArchive = isManager;
  const canDelete = isManager;

  const members = useMemo(() => project.members, [project]);

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <ProjectSettingsHeader projectName={project.name} />

        <ProjectDetailsCard
          initialName={project.name}
          initialDescription={project.description}
        />

        <ProjectMembersCard
          members={members}
          workspaceMembers={WORKSPACE_MEMBERS}
          isManager={isManager}
          onMembersChange={(next) => setProject((p) => ({ ...p, members: next }))}
        />

        <ProjectVisibilityCard visibility={visibility} onChange={setVisibility} />

        {canArchive && (
          <ArchiveProjectCard
            isManager={isManager}
            onArchive={() => setArchiveOpen(true)}
          />
        )}

        {canDelete && (
          <DeleteProjectCard
            isManager={isManager}
            onDelete={() => setDeleteOpen(true)}
          />
        )}
      </div>

      <ConfirmArchiveDialog
        open={archiveOpen}
        projectName={project.name}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => setArchiveOpen(false)}
      />

      <ConfirmDeleteProjectDialog
        open={deleteOpen}
        projectName={project.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
      />
    </main>
  );
}
