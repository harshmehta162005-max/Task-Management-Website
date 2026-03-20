"use client";

import Link from "next/link";
import { ExportButton } from "./ExportButton";

type Props = {
  onExport?: () => void;
  projectActivityHref?: string;
};

export function ActivityHeader({ onExport, projectActivityHref }: Props) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Activity</h1>
        <p className="text-slate-600 dark:text-slate-400">Track everything happening across your workspace.</p>
      </div>
      <div className="flex items-center gap-2">
        {projectActivityHref && (
          <Link
            href={projectActivityHref}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            View project activity
          </Link>
        )}
        <ExportButton onClick={onExport} />
      </div>
    </header>
  );
}
