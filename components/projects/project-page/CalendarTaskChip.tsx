type Props = {
  title: string;
  color?: "red" | "amber" | "emerald" | "primary" | "slate";
  onClick: () => void;
};

const colors = {
  red: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500 hover:text-white dark:text-red-400 dark:hover:text-white dark:border-red-500/20",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500 hover:text-white dark:text-amber-400 dark:hover:text-white dark:border-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 dark:hover:text-white dark:border-emerald-500/20",
  primary: "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white dark:text-primary-400 dark:hover:text-white dark:border-primary/20",
  slate: "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-600 hover:text-white dark:text-slate-400 dark:hover:text-white dark:border-slate-500/20",
};

export function CalendarTaskChip({ title, color = "primary", onClick }: Props) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`mb-1 block w-full truncate rounded-md border px-2 py-[3px] text-left text-[10px] sm:text-[11px] font-semibold transition ${colors[color]}`}
    >
      {title}
    </button>
  );
}
