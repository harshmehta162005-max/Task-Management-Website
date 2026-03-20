import { Archive } from "lucide-react";

type Props = {
  onArchive: () => void;
  isManager: boolean;
};

export function ArchiveProjectCard({ onArchive, isManager }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-amber-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Archive project</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Archiving hides the project from active lists. You can restore it later.
          </p>
        </div>
        {isManager ? (
          <button
            onClick={onArchive}
            className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400"
          >
            Archive project
          </button>
        ) : (
          <span className="text-xs font-semibold text-slate-500">Manager access required</span>
        )}
      </div>
    </section>
  );
}
