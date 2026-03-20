import { Eye } from "lucide-react";

type Props = {
  visibility: "private" | "workspace";
  onChange: (v: "private" | "workspace") => void;
};

export function ProjectVisibilityCard({ visibility, onChange }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Eye className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Visibility</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Who can view this project.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/50 dark:border-slate-700 dark:bg-[#0d1422]">
          <input
            type="radio"
            name="visibility"
            checked={visibility === "private"}
            onChange={() => onChange("private")}
            className="mt-1 h-4 w-4 border-slate-300 text-primary focus:ring-primary"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Private</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Only project members can view.</p>
          </div>
        </label>
        <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-primary/50 dark:border-slate-700 dark:bg-[#0d1422]">
          <input
            type="radio"
            name="visibility"
            checked={visibility === "workspace"}
            onChange={() => onChange("workspace")}
            className="mt-1 h-4 w-4 border-slate-300 text-primary focus:ring-primary"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Workspace visible</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Everyone in the workspace can view.</p>
          </div>
        </label>
      </div>
    </section>
  );
}
