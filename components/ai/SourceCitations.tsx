type Props = {
  sources: string[];
};

export function SourceCitations({ sources }: Props) {
  if (!sources.length) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
      <span className="w-full">Sources</span>
      {sources.map((s, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

