type Props = {
  current: number;
  total?: number;
  label?: string;
};

export function StepIndicator({ current, total = 3, label = "Create Workspace" }: Props) {
  const progress = Math.min(Math.max(current, 1), total) / total;
  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex items-end justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Step {current} of {total}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
