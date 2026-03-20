import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function ProjectNotFound({ workspaceSlug }: { workspaceSlug: string }) {
  return (
    <main className="min-h-screen bg-background-light px-4 py-12 text-slate-900 dark:bg-background-dark dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold">Project not found</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The project you’re looking for doesn’t exist or was removed.
        </p>
        <Link
          href={`/${workspaceSlug}/projects`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          Back to Projects
        </Link>
      </div>
    </main>
  );
}
