import { ShieldCheck, Dot } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  name: string;
  slug: string;
  role: "MEMBER" | "MANAGER";
  logoUrl?: string;
};

export function WorkspaceCardPreview({ name, slug, role, logoUrl }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "h-14 w-14 rounded-lg bg-cover bg-center bg-slate-200 dark:bg-slate-800",
            !logoUrl && "flex items-center justify-center text-lg font-bold text-primary"
          )}
          style={logoUrl ? { backgroundImage: `url(${logoUrl})` } : undefined}
        >
          {!logoUrl ? name.slice(0, 2).toUpperCase() : null}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">{name}</span>
            <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {role}
            </span>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">{slug}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Dot className="h-5 w-5 text-emerald-500" />
      </div>
    </div>
  );
}
