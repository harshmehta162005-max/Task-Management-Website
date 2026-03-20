type Status = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";

const styles: Record<Status, string> = {
  TODO: "bg-slate-500/10 text-slate-500",
  IN_PROGRESS: "bg-primary/10 text-primary",
  BLOCKED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  DONE: "bg-emerald-500/10 text-emerald-500",
};

export function StatusBadge({ status }: { status: Status }) {
  const label =
    status === "IN_PROGRESS" ? "In Progress" : status === "DONE" ? "Done" : status === "TODO" ? "Todo" : "Blocked";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {label}
    </span>
  );
}
