"use client";

type Props = {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
};

export function DateRangePicker({ from, to, onChange }: Props) {
  return (
    <div className="flex gap-2">
      <input
        type="date"
        value={from || ""}
        onChange={(e) => onChange({ from: e.target.value || undefined, to })}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
      />
      <input
        type="date"
        value={to || ""}
        onChange={(e) => onChange({ from, to: e.target.value || undefined })}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
      />
    </div>
  );
}
