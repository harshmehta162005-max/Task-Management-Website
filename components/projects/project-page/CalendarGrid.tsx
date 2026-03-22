import { Pencil, StickyNote } from "lucide-react";
import { CalendarTaskChip } from "./CalendarTaskChip";

type TaskChip = { id: string; title: string; color?: "primary" | "emerald" | "amber" | "slate" };

type CalendarNote = {
  id: string;
  date: string;
  content: string;
  author: { id: string; name: string; avatarUrl?: string | null };
};

type Props = {
  month: Date;
  tasksByDate: Record<string, TaskChip[]>;
  onTaskClick: (id: string) => void;
  notes?: CalendarNote[];
  isManager?: boolean;
  onEditNote?: (date: string, note?: CalendarNote) => void;
  onViewNote?: (date: string, note: CalendarNote) => void;
};

export function CalendarGrid({ month, tasksByDate, onTaskClick, notes = [], isManager = false, onEditNote, onViewNote }: Props) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const startWeekday = start.getDay();
  const daysInMonth = end.getDate();

  const notesByDate: Record<string, CalendarNote> = {};
  notes.forEach((n) => {
    // API returns ISO UTC strings like "2026-03-22T00:00:00.000Z" — extract just the date part
    const raw = typeof n.date === "string" ? n.date : new Date(n.date).toISOString();
    const key = raw.slice(0, 10);
    notesByDate[key] = n;
  });

  const cells: Array<{ date: Date | null; key: string }> = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    cells.push({ date, key: `cell-${d}` });
  }

  return (
    <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-800">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="border-b border-r border-slate-200 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500"
        >
          {day}
        </div>
      ))}
      {cells.map(({ date, key }) => {
        const iso = date ? toLocalISO(date) : "";
        const chips = date ? tasksByDate[iso] || [] : [];
        const note = date ? notesByDate[iso] : undefined;
        const hasNote = !!note;

        return (
          <div
            key={key}
            className="group relative min-h-[120px] border-b border-r border-slate-200 px-2 py-2 transition dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
          >
            {/* Date number + note indicator */}
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-200">
                  {date?.getDate() ?? ""}
                </span>
                {hasNote && (
                  <button
                    onClick={() => {
                      if (isManager && onEditNote) {
                        onEditNote(iso, note);
                      } else if (onViewNote && note) {
                        onViewNote(iso, note);
                      }
                    }}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20"
                    title="View note"
                  >
                    <StickyNote className="h-2.5 w-2.5 text-amber-500" />
                  </button>
                )}
              </div>

              {/* Pencil icon — managers only, on hover */}
              {date && isManager && onEditNote && (
                <button
                  onClick={() => onEditNote(iso, note)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-400 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-primary hover:text-white dark:bg-slate-700 dark:text-slate-300"
                  title={hasNote ? "Edit note" : "Add note"}
                >
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Task chips */}
            <div className="space-y-1">
              {chips.slice(0, 3).map((task) => (
                <CalendarTaskChip key={task.id} title={task.title} color={task.color} onClick={() => onTaskClick(task.id)} />
              ))}
              {chips.length > 3 ? (
                <button className="text-xs font-semibold text-primary" onClick={() => onTaskClick(chips[0].id)}>
                  +{chips.length - 3} more
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/** Format a local Date as "YYYY-MM-DD" without UTC conversion */
function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
