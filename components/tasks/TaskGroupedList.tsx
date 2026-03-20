import { TaskGroupCard } from "./TaskGroupCard";
import { QuickAddTask } from "./QuickAddTask";
import type { TaskItem } from "./TaskRow";

type Props = {
  groups: Record<string, TaskItem[]>;
  onToggleComplete: (id: string) => void;
  onStartWork: (id: string) => void;
  onOpen: (id: string) => void;
  onQuickAdd: (title: string) => void;
};

const GROUP_ORDER = ["Overdue", "Today", "This Week", "Upcoming", "No Due Date"];

export function TaskGroupedList({ groups, onToggleComplete, onStartWork, onOpen, onQuickAdd }: Props) {
  return (
    <div className="space-y-8">
      {GROUP_ORDER.map((key) => (
        <div key={key}>
          <TaskGroupCard
            title={key}
            tasks={groups[key] || []}
            onToggleComplete={onToggleComplete}
            onStartWork={onStartWork}
            onOpen={onOpen}
          />
          {key === "Today" && <QuickAddTask onAdd={onQuickAdd} />}
        </div>
      ))}
    </div>
  );
}
