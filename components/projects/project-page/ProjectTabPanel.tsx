import { ReactNode } from "react";
import { KanbanSquare } from "lucide-react";

type Props = {
  title: string;
  description: string;
  visible: boolean;
  cta?: ReactNode;
};

export function ProjectTabPanel({ title, description, visible, cta }: Props) {
  if (!visible) return null;
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-[#0f172a]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <KanbanSquare className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {cta ? <div className="mt-4 flex items-center justify-center gap-3">{cta}</div> : null}
    </div>
  );
}
