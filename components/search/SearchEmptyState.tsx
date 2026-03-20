import { SearchX } from "lucide-react";

type Props = {
  query: string;
};

export function SearchEmptyState({ query }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
        <SearchX className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">No results</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Nothing found for “{query || "…" }”.</p>
      </div>
      <div className="flex gap-2">
        <button className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90">
          Create task
        </button>
        <button className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary">
          Create project
        </button>
      </div>
    </div>
  );
}
