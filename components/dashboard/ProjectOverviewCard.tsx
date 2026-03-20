import Link from "next/link";
import { MoreHorizontal, Rocket } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  avatars: string[];
  overdue?: boolean;
  href: string;
};

export function ProjectOverviewCard({ id, name, description, progress, avatars, overdue, href }: Props) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#111827]"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
          <Rocket className="h-5 w-5 text-indigo-500" />
        </div>
        <MoreHorizontal className="h-4 w-4 text-slate-400" />
      </div>
      <h3 className="mb-1 font-bold text-slate-900 dark:text-white">{name}</h3>
      <p className="mb-4 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-[#111827]"
              />
            ))}
            {avatars.length > 3 ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600 dark:border-[#111827] dark:bg-slate-700 dark:text-slate-200">
                +{avatars.length - 3}
              </div>
            ) : null}
          </div>
          {overdue ? (
            <span className="rounded-full bg-rose-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-500">
              Overdue
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
