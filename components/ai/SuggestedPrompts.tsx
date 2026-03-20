const prompts = [
  "What’s blocked in Project Alpha?",
  "Summarize this week’s changes",
  "Who is overloaded?",
  "Create tasks from these notes",
];

export function SuggestedPrompts({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((p) => (
        <button
          key={p}
          onClick={() => onSelect(p)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
