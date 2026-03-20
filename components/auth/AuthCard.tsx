import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function AuthCard({ children, title = "Welcome back", subtitle = "Sign in to your workspace" }: Props) {
  return (
    <div className="w-full max-w-[480px] rounded-2xl border border-[rgba(15,23,42,0.12)] bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-[#111827]/90">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner shadow-primary/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">TeamOS</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
