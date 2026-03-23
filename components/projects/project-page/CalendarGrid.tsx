import { Pencil, StickyNote } from "lucide-react";
import { CalendarTaskChip } from "./CalendarTaskChip";

type TaskChip = { id: string; title: string; color?: "red" | "amber" | "emerald" | "primary" | "slate" };

type CalendarNote = {
  id: string;
  date: string;
  content: string;
  isPublic: boolean;
  authorId: string;
  author: { id: string; name: string; avatarUrl?: string | null };
};

type Props = {
  month: Date;
  tasksByDate: Record<string, TaskChip[]>;
  onTaskClick: (id: string) => void;
  onDateTasksClick?: (date: string, tasks: TaskChip[]) => void;
  notes?: CalendarNote[];
  onOpenNotes?: (date: string, notesForDate: CalendarNote[]) => void;
  onCreateNote?: (date: string) => void;
};

export function CalendarGrid({ month, tasksByDate, onTaskClick, onDateTasksClick, notes = [], onOpenNotes, onCreateNote }: Props) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const startWeekday = start.getDay();
  const daysInMonth = end.getDate();

  const notesByDate: Record<string, CalendarNote[]> = {};
  notes.forEach((n) => {
    const raw = typeof n.date === "string" ? n.date : new Date(n.date).toISOString();
    const key = raw.slice(0, 10);
    if (!notesByDate[key]) notesByDate[key] = [];
    notesByDate[key].push(n);
  });

  const cells: Array<{ date: Date | null; key: string }> = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    cells.push({ date, key: `cell-${d}` });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/20">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
      {cells.map(({ date, key }) => {
        const iso = date ? toLocalISO(date) : "";
        const chips = date ? tasksByDate[iso] || [] : [];
        const dateNotes = date ? notesByDate[iso] || [] : [];
        const noteCount = dateNotes.length;
        const isToday = date && toLocalISO(new Date()) === iso;

        return (
          <div
            key={key}
            className={`group relative min-h-[120px] border-b border-r border-slate-100 p-2 transition-colors dark:border-slate-800/60 ${
              date
                ? "cursor-pointer bg-white dark:bg-[#0f172a]/40 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                : "bg-slate-50/30 dark:bg-[#111827]/30"
            }`}
            onClick={() => {
              if (date && chips.length > 0) {
                onDateTasksClick?.(iso, chips);
              }
            }}
          >
            {date && (
              <>
                {/* Date number + note count on the left */}
                <div className="flex items-center gap-1 mb-1">
                  <span className={`text-xs font-semibold ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white" : "text-slate-600 dark:text-slate-400"}`}>
                    {date.getDate()}
                  </span>
                  {noteCount > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenNotes?.(iso, dateNotes); }}
                      className="flex items-center gap-0.5 rounded-md bg-amber-50 px-1 py-0.5 text-[10px] font-bold text-amber-600 transition hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
                      title={`${noteCount} note${noteCount > 1 ? "s" : ""}`}
                    >
                      <StickyNote className="h-2.5 w-2.5" />
                      {noteCount}
                    </button>
                  )}
                </div>

                {/* Task chips — max 2 visible */}
                <div className="space-y-0.5 min-w-0">
                  {chips.slice(0, 2).map((t) => (
                    <CalendarTaskChip key={t.id} title={t.title} color={t.color} onClick={() => onTaskClick(t.id)} />
                  ))}
                  {chips.length > 2 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDateTasksClick?.(iso, chips); }}
                      className="w-full rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-500 hover:text-primary hover:bg-primary/5 transition dark:text-slate-400 dark:hover:text-primary"
                    >
                      +{chips.length - 2} more
                    </button>
                  )}
                </div>

                {/* Pencil icon on hover */}
                <button
                  onClick={(e) => { e.stopPropagation(); onCreateNote?.(iso); }}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-slate-400 opacity-0 shadow-sm transition group-hover:opacity-100 hover:text-primary hover:bg-primary/10 dark:bg-slate-800/90"
                  title="Add note"
                >
                  <Pencil className="h-2.5 w-2.5" />
                </button>
              </>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
