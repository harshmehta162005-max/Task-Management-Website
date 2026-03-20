import type { ReactNode } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function InviteCard({ children, className }: Props) {
  return (
    <div
      className={cn(
        "w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#111827] dark:text-slate-100",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 pt-10 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
          <Globe className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold tracking-widest text-slate-900 dark:text-white">TeamOS</h1>
      </div>
      <div className="space-y-8 px-8 pb-10">{children}</div>
      <div className="flex justify-center border-t border-slate-200 bg-slate-50/50 px-8 py-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:border-white/5 dark:bg-white/5 dark:text-slate-500">
        Secure invitation by TeamOS Cloud
      </div>
    </div>
  );
}
