import { X, Trash2, CheckCircle2, CalendarDays, UserPlus, Tags } from "lucide-react";

type Props = {
  count: number;
  onClear: () => void;
};

export function BulkActionBar({ count, onClear }: Props) {
  if (count === 0) return null;
  return (
    <div className="flex items-center justify-between rounded-t-2xl bg-primary/95 px-4 py-3 text-white shadow-lg shadow-primary/30">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">{count} selected</span>
        <div className="hidden gap-3 text-sm font-semibold sm:flex">
          <Action label="Complete" icon={<CheckCircle2 className="h-4 w-4" />} />
          <Action label="Set date" icon={<CalendarDays className="h-4 w-4" />} />
          <Action label="Assign" icon={<UserPlus className="h-4 w-4" />} />
          <Action label="Tag" icon={<Tags className="h-4 w-4" />} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Action label="Delete" icon={<Trash2 className="h-4 w-4" />} />
        <button
          onClick={onClear}
          className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Action({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-semibold transition hover:bg-white/10">
      {icon}
      {label}
    </button>
  );
}

