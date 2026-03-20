import { cn } from "@/lib/utils/cn";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

const styles: Record<Priority, string> = {
  LOW: "bg-blue-500/10 text-blue-500",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  HIGH: "bg-rose-500/10 text-rose-500",
  URGENT: "bg-red-600/15 text-red-600 dark:text-red-400",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        styles[priority]
      )}
    >
      {priority}
    </span>
  );
}
