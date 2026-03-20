import { Building2, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  children: ReactNode;
  error?: string | null;
};

export function WorkspaceCreateCard({ children, error }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111827] md:p-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create your workspace</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This is your team’s home for projects and tasks.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : null}

      {children}
    </div>
  );
}
