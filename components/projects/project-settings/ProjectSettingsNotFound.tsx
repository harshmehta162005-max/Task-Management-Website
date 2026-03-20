import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export function ProjectSettingsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">Project not found</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">We couldn’t locate that project.</p>
      <Link
        href="../.."
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
      >
        <ArrowLeftCircle className="h-4 w-4" />
        Back to projects
      </Link>
    </div>
  );
}
