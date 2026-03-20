import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  filter: "active" | "archived";
  onFilterChange: (v: "active" | "archived") => void;
  onOpenCreate: () => void;
};

export function ProjectsHeader({ query, onQueryChange, filter, onFilterChange, onOpenCreate }: Props) {
  return (
    <header className="mb-8 flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track all workspace projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create project</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-2 dark:border-border-dark dark:bg-[#111827] md:flex-row">
        <div className="group relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-xl border-none bg-slate-50 px-10 py-2 text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-primary/50 dark:bg-background-dark/50 dark:text-slate-100"
            placeholder="Search projects..."
            type="text"
          />
        </div>
        <div className="flex w-full items-center rounded-xl bg-slate-100 p-1 dark:bg-background-dark md:w-auto">
          {(["active", "archived"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => onFilterChange(opt)}
              className={cn(
                "flex-1 rounded-lg px-6 py-1.5 text-sm font-medium transition-colors md:flex-none",
                filter === opt
                  ? "bg-white text-primary shadow-sm dark:bg-[#111827]"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              {opt === "active" ? "Active" : "Archived"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

