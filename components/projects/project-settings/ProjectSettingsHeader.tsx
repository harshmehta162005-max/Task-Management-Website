import Link from "next/link";
import { ChevronRight, Settings } from "lucide-react";

type Props = {
  projectName: string;
};

export function ProjectSettingsHeader({ projectName }: Props) {
  return (
    <header className="space-y-3">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
        <Link className="hover:text-primary" href="../..">
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate max-w-[200px] text-slate-600 dark:text-slate-300">{projectName}</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-primary font-semibold">Settings</span>
      </nav>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Project Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage configuration and access for this project.
          </p>
        </div>
      </div>
    </header>
  );
}
