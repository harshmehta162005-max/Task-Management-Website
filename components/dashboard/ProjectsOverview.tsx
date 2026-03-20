import { ProjectOverviewCard } from "./ProjectOverviewCard";

type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  avatars: string[];
  overdue?: boolean;
  href: string;
};

type Props = {
  projects: Project[];
};

export function ProjectsOverview({ projects }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectOverviewCard key={project.id} {...project} />
      ))}
    </div>
  );
}
