import { CalendarTaskChip } from "./CalendarTaskChip";

type TaskChip = { id: string; title: string; color?: "primary" | "emerald" | "amber" | "slate" };

type Props = {
  month: Date;
  tasksByDate: Record<string, TaskChip[]>;
  onTaskClick: (id: string) => void;
};

export function CalendarGrid({ month, tasksByDate, onTaskClick }: Props) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const startWeekday = start.getDay(); // 0-6
  const daysInMonth = end.getDate();

  const cells: Array<{ date: Date | null; key: string }> = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: `pad-${i}` });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(month.getFullYear(), month.getMonth(), d);
    cells.push({ date, key: date.toISOString() });
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
        const iso = date ? date.toISOString().slice(0, 10) : "";
        const chips = date ? tasksByDate[iso] || [] : [];
        return (
          <div
            key={key}
            className="min-h-[120px] border-b border-r border-slate-200 px-2 py-2 transition dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30"
          >
            <div className="mb-1 text-sm font-semibold text-slate-600 dark:text-slate-200">{date?.getDate() ?? ""}</div>
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

