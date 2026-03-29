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

const GROUP_ORDER = ["Overdue", "Today", "This Week", "Upcoming", "No Due Date"];

export function TaskGroupedList({ groups, onToggleComplete, onStartWork, onOpen, onQuickAdd, onSubmitReview, onDelete, onDuplicate, onMove }: Props) {
  return (
    <div className="space-y-8">
      {GROUP_ORDER.map((key) => {
        const tasks = groups[key] || [];
        // Hide completely empty groups, but always show Today to allow quick-adds
        if (tasks.length === 0 && key !== "Today") return null;

        return (
          <div key={key}>
            <TaskGroupCard
              title={key}
              tasks={tasks}
              onToggleComplete={onToggleComplete}
              onStartWork={onStartWork}
              onOpen={onOpen}
              onSubmitReview={onSubmitReview}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onMove={onMove}
            />
            {key === "Today" && <QuickAddTask onAdd={onQuickAdd} />}
          </div>
        );
      })}
    </div>
  );
}
