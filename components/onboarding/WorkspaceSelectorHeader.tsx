import { Plus, Search } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
};

export function WorkspaceSelectorHeader({ query, onQueryChange, onCreate }: Props) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Choose a workspace</h1>
        <p className="text-lg text-slate-400">Select where you want to work today.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 transition-colors group-focus-within:text-primary">
            <Search className="h-5 w-5" />
          </span>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-10 py-2.5 text-sm text-slate-200 outline-none transition focus:border-primary focus:ring-primary"
            placeholder="Search workspaces..."
            type="text"
          />
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create workspace
        </button>
      </div>
    </div>
  );
}
