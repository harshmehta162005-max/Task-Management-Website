type Props = {
  value: string;
  prefix?: string;
  onChange: (val: string) => void;
  helper?: string;
};

export function SlugInput({ value, prefix = "https://teamos.io/", onChange, helper }: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-800 dark:text-slate-100">Workspace Slug</label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 text-sm text-slate-400">{prefix}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-36 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          placeholder="workspace-slug"
        />
      </div>
      {helper ? <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p> : null}
    </div>
  );
}
