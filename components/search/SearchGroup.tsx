type Props = {
  title: string;
  children: React.ReactNode;
};

export function SearchGroup({ title, children }: Props) {
  return (
    <div className="space-y-2">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
