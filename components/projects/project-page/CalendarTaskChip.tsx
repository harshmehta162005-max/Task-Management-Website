type Props = {
  title: string;
  color?: "primary" | "emerald" | "amber" | "slate";
  onClick: () => void;
};

const colors = {
  primary: "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white",
  emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500 hover:text-white",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500 hover:text-white",
  slate: "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-600 hover:text-white",
};

export function CalendarTaskChip({ title, color = "primary", onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`mb-1 block w-full truncate rounded-md border px-2 py-1 text-left text-[11px] font-bold transition ${colors[color]}`}
    >
      {title}
    </button>
  );
}

