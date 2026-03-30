import { ProjectOverviewCard } from "./ProjectOverviewCard";
import Link from "next/link";

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
  workspaceSlug: string;
};

export function ProjectsOverview({ projects, workspaceSlug }: Props) {
  const displayProjects = projects.slice(0, 2);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Current Projects</h2>
        <Link href={`/${workspaceSlug}/projects`} className="text-xs font-semibold text-primary hover:underline">
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {displayProjects.map((project) => (
          <ProjectOverviewCard key={project.id} {...project} />
        ))}
        {displayProjects.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <p className="text-sm text-slate-500">No active projects to show.</p>
          </div>
        )}
      </div>
    </section>
  );
}
