type Props = {
  label?: string;
};

export function AuthDivider({ label = "or" }: Props) {
  return (
    <div className="relative my-4 flex items-center">
      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      <span className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
    </div>
  );
}
