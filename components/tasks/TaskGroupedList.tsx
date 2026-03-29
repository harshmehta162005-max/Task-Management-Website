import { TaskGroupCard } from "./TaskGroupCard";
import { QuickAddTask } from "./QuickAddTask";
import type { TaskItem } from "./TaskRow";

type Props = {
  groups: Record<string, TaskItem[]>;
  onToggleComplete: (id: string) => void;
  onStartWork: (id: string) => void;
  onOpen: (id: string) => void;
  onQuickAdd: (title: string) => void;
  onSubmitReview?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMove?: (id: string) => void;
};

const GROUP_CONFIG: { key: string; emoji: string; accentColor: string }[] = [
  { key: "Overdue", emoji: "🔴", accentColor: "rose" },
  { key: "Due Today", emoji: "🟡", accentColor: "amber" },
  { key: "Upcoming", emoji: "🟢", accentColor: "emerald" },
  { key: "Waiting for You", emoji: "⏳", accentColor: "amber" },
  { key: "Completed This Week", emoji: "✅", accentColor: "emerald" },
  { key: "No Due Date", emoji: "📋", accentColor: "slate" },
];

export function TaskGroupedList({ groups, onToggleComplete, onStartWork, onOpen, onQuickAdd, onSubmitReview, onDelete, onDuplicate, onMove }: Props) {
  return (
    <div className="space-y-1">
      {GROUP_CONFIG.map(({ key, emoji, accentColor }) => {
        const tasks = groups[key] || [];
        // Hide completely empty groups, but always show Due Today to allow quick-adds
        if (tasks.length === 0 && key !== "Due Today") return null;

        return (
          <div key={key}>
            <TaskGroupCard
              title={key}
              emoji={emoji}
              accentColor={accentColor}
              tasks={tasks}
              onToggleComplete={onToggleComplete}
              onStartWork={onStartWork}
              onOpen={onOpen}
              onSubmitReview={onSubmitReview}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onMove={onMove}
            />
            {key === "Due Today" && <QuickAddTask onAdd={onQuickAdd} />}
          </div>
        );
      })}
    </div>
  );
}
