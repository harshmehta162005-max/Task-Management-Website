import { useState } from "react";
import { Sparkles, Copy, Send } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Props = {
  projects: { id: string; name: string }[];
};

export function WeeklySummaryTrigger({ projects }: Props) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [summary, setSummary] = useState("");

  const generate = () => {
    setSummary(
      "This week, Mobile Redesign completed 12 tasks, closed 3 bugs, and finalized the onboarding flow. Risks: OAuth delay, 1 blocker in QA. Next: finalize analytics charts and ship beta build Friday."
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Weekly summary</h3>
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project
          </label>
          <Select
            value={projectId}
            onChange={setProjectId}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
            portal={false}
          />
        </div>
        <button
          onClick={generate}
          className="w-full rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
        >
          Generate summary
        </button>

        {summary ? (
          <div className="space-y-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200">
            {summary}
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200">
                <Send className="h-4 w-4" />
                Post to activity
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200">
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
