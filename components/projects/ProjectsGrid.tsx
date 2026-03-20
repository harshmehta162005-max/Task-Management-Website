import type { Project } from "./types";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";
import { ProjectsEmptyState } from "./ProjectsEmptyState";

type Props = {
  projects: Project[];
  isLoading: boolean;
  isManager: boolean;
  onCreate: () => void;
  workspaceSlug: string;
};

export function ProjectsGrid({ projects, isLoading, isManager, onCreate, workspaceSlug }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProjectCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!projects.length) {
    return <ProjectsEmptyState onCreate={onCreate} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isManager={isManager}
          href={`/${workspaceSlug}/projects/${project.id}`}
        />
      ))}
    </div>
  );
}
