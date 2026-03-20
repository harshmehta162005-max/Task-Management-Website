import { UserPlus } from "lucide-react";

type Props = {
  members: string[];
  total: number;
  onInvite: () => void;
};

export function ProjectMembersRow({ members, total, onInvite }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-white/10 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {members.slice(0, 5).map((src, idx) => (
            <div
              key={src + idx}
              className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-200 dark:border-[#111827]"
            >
              <img src={src} alt="member avatar" className="h-full w-full object-cover" />
            </div>
          ))}
          {total > members.length ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-800 text-xs font-bold text-white dark:border-[#111827]">
              +{total - members.length}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
          <span>{total} members</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <button
            onClick={onInvite}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <UserPlus className="h-4 w-4" />
            Invite to project
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>Priority:</span>
        <span className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-rose-500">High</span>
      </div>
    </div>
  );
}
