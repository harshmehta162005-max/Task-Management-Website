import { cn } from "@/lib/utils/cn";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  onUse: () => void;
};

export function TemplateCard({ icon, title, description, onUse }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        onClick={onUse}
        className="mt-auto inline-flex items-center text-xs font-semibold text-primary hover:underline"
      >
        Use template
      </button>
    </div>
  );
}
