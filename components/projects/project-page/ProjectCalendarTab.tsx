import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarNotesPopup } from "./CalendarNotesPopup";
import { CalendarNoteEditor } from "./CalendarNoteEditor";
import { CalendarTasksPopup } from "./CalendarTasksPopup";
import { KanbanTask } from "@/components/tasks/KanbanBoard";

type CalendarNote = {
  id: string;
  date: string;
  content: string;
  isPublic: boolean;
  authorId: string;
  author: { id: string; name: string; avatarUrl?: string | null };
  createdAt?: string;
};

type TaskChip = {
  id: string;
  title: string;
  color?: "red" | "amber" | "emerald" | "primary" | "slate";
};

type Props = {
  tasks: KanbanTask[];
  onOpenTask: (id: string) => void;
  onAddTask?: () => void;
  isManager?: boolean;
  projectId?: string;
  workspaceSlug?: string;
  currentUserId?: string;
};

function toLocalISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ProjectCalendarTab({
  tasks,
  onOpenTask,
  onAddTask,
  isManager = false,
  projectId,
  workspaceSlug,
  currentUserId,
}: Props) {
  const [month, setMonth] = useState(() => new Date());
  const [notes, setNotes] = useState<CalendarNote[]>([]);

  // Notes popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDate, setPopupDate] = useState("");
  const [popupNotes, setPopupNotes] = useState<CalendarNote[]>([]);

  // Note editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDate, setEditorDate] = useState("");
  const [editorNote, setEditorNote] = useState<CalendarNote | null>(null);
  const [editorReadOnly, setEditorReadOnly] = useState(false);

  // Tasks popup state
  const [tasksPopupOpen, setTasksPopupOpen] = useState(false);
  const [tasksPopupDate, setTasksPopupDate] = useState("");
  const [tasksPopupTasks, setTasksPopupTasks] = useState<TaskChip[]>([]);

  const todayISO = toLocalISO(new Date());

  const tasksByDate = useMemo(() => {
    const map: Record<string, TaskChip[]> = {};
    tasks.forEach((t) => {
      if (!t.dueDate) return;
      const key = t.dueDate.slice(0, 10);

      // Color logic: 🟢 completed → emerald, 🔴 overdue → red, 🟡 due today → amber, rest → primary
      let color: TaskChip["color"];
      if (t.status === "DONE") {
        color = "emerald";
      } else if (key < todayISO) {
        color = "red";
      } else if (key === todayISO) {
        color = "amber";
      } else {
        color = "primary";
      }

      if (!map[key]) map[key] = [];
      map[key].push({ id: t.id, title: t.title, color });
    });
    return map;
  }, [tasks, todayISO]);

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;

  const changeMonth = (delta: number) => {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const loadNotes = useCallback(async () => {
    if (!projectId || !workspaceSlug) return;
    try {
      const res = await fetch(
        `/api/projects/${projectId}/calendar-notes?workspaceSlug=${workspaceSlug}&month=${monthKey}`
      );
      if (res.ok) setNotes(await res.json());
    } catch {}
  }, [projectId, workspaceSlug, monthKey]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  // --- Notes popup handlers ---
  const handleOpenNotes = (date: string, notesForDate: CalendarNote[]) => {
    setPopupDate(date);
    setPopupNotes(notesForDate);
    setPopupOpen(true);
  };

  const handleAddNew = () => {
    setPopupOpen(false);
    setEditorDate(popupDate);
    setEditorNote(null);
    setEditorReadOnly(false);
    setEditorOpen(true);
  };

  const handleCreateNote = (date: string) => {
    setEditorDate(date);
    setEditorNote(null);
    setEditorReadOnly(false);
    setEditorOpen(true);
  };

  const handleEditNote = (note: CalendarNote) => {
    setPopupOpen(false);
    setEditorDate(note.date.slice(0, 10));
    setEditorNote(note);
    setEditorReadOnly(false);
    setEditorOpen(true);
  };

  const handleViewNote = (note: CalendarNote) => {
    setPopupOpen(false);
    setEditorDate(note.date.slice(0, 10));
    setEditorNote(note);
    setEditorReadOnly(true);
    setEditorOpen(true);
  };

  const handleSaveNote = async (date: string, content: string, noteIsPublic: boolean) => {
    if (!projectId || !workspaceSlug) return;
    let res: Response;
    if (editorNote?.id) {
      res = await fetch(`/api/projects/${projectId}/calendar-notes/${editorNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, workspaceSlug, isPublic: noteIsPublic }),
      });
    } else {
      res = await fetch(`/api/projects/${projectId}/calendar-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, content, workspaceSlug, isPublic: noteIsPublic }),
      });
    }
    if (!res.ok) {
      const raw = await res.text();
      let msg = `HTTP ${res.status}`;
      try { msg = JSON.parse(raw).error || msg; } catch { msg = raw.slice(0, 200) || msg; }
      throw new Error(msg);
    }
    await loadNotes();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!projectId || !workspaceSlug) return;
    await fetch(`/api/projects/${projectId}/calendar-notes/${noteId}?workspaceSlug=${workspaceSlug}`, { method: "DELETE" });
    await loadNotes();
  };

  // --- Tasks popup handler ---
  const handleDateTasksClick = (date: string, dateTasks: TaskChip[]) => {
    setTasksPopupDate(date);
    setTasksPopupTasks(dateTasks);
    setTasksPopupOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#111827] md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project Schedule</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track milestones and deliverables.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-[#0f172a]">
            <button onClick={() => changeMonth(-1)} className="rounded-lg p-2 hover:bg-white dark:hover:bg-slate-800" aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{monthLabel}</span>
            <button onClick={() => changeMonth(1)} className="rounded-lg p-2 hover:bg-white dark:hover:bg-slate-800" aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button onClick={onAddTask} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
        <CalendarGrid
          month={month}
          tasksByDate={tasksByDate}
          onTaskClick={onOpenTask}
          onDateTasksClick={handleDateTasksClick}
          notes={notes}
          onOpenNotes={handleOpenNotes}
          onCreateNote={handleCreateNote}
        />
      </div>

      {Object.keys(tasksByDate).length === 0 && notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-300">
          No tasks scheduled this month.
        </div>
      ) : null}

      {/* Tasks popup */}
      <CalendarTasksPopup
        open={tasksPopupOpen}
        date={tasksPopupDate}
        tasks={tasksPopupTasks}
        onClose={() => setTasksPopupOpen(false)}
        onTaskClick={onOpenTask}
      />

      {/* Notes list popup */}
      <CalendarNotesPopup
        open={popupOpen}
        date={popupDate}
        notes={popupNotes}
        currentUserId={currentUserId || ""}
        isManager={isManager}
        onClose={() => setPopupOpen(false)}
        onAddNew={handleAddNew}
        onEditNote={handleEditNote}
        onViewNote={handleViewNote}
      />

      {/* Note editor */}
      <CalendarNoteEditor
        open={editorOpen}
        date={editorDate}
        note={editorNote}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        readOnly={editorReadOnly}
        isManager={isManager}
        currentUserId={currentUserId}
      />
    </div>
  );
}
