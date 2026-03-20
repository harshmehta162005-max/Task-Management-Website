import { Clock } from "lucide-react";

type Props = {
  avatar: string;
  actor: string;
  action: string;
  time: string;
  badge?: string;
};

export function ActivityItem({ avatar, actor, action, time, badge }: Props) {
  return (
    <div className="grid grid-cols-[52px_1fr] gap-4">
      <div className="flex justify-center">
        <img src={avatar} alt={actor} className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-slate-900" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-900 dark:text-slate-100">
            <span className="font-semibold">{actor}</span> {action}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {time}
          </div>
        </div>
        {badge ? (
          <span className="mt-3 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );
}
