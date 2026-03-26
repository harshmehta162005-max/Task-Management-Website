import { User, FolderOpen, Building2 } from "lucide-react";

type ChatMode = "personal" | "project" | "workspace";

const PROMPTS: Record<ChatMode, string[]> = {
  personal: [
    "Help me brainstorm ideas for…",
    "Draft a professional message about…",
    "Explain this concept simply:",
    "Help me plan my week",
  ],
  project: [
    "What tasks are pending?",
    "Who is overloaded on this project?",
    "Summarize the project status",
    "What are the current blockers?",
  ],
  workspace: [
    "Which project is behind schedule?",
    "Team performance summary",
    "What are the biggest risks this week?",
    "Compare all project progress",
  ],
};

const ICONS: Record<ChatMode, typeof User> = {
  personal: User,
  project: FolderOpen,
  workspace: Building2,
};

export function SuggestedPrompts({
  mode,
  onSelect,
}: {
  mode: ChatMode;
  onSelect: (text: string) => void;
}) {
  const prompts = PROMPTS[mode];
  const Icon = ICONS[mode];

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => onSelect(p)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary"
        >
          <Icon className="h-3 w-3 opacity-50" />
          {p}
        </button>
      ))}
    </div>
  );
}
