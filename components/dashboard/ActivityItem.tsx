import Link from "next/link";

type Props = {
  actor: string;
  action: string;
  time: string;
  entity: string;
  href: string;
  avatar: string;
};

export function ActivityItem({ actor, action, time, entity, href, avatar }: Props) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-white dark:ring-[#111827]" />
      <div className="mb-1 flex items-center gap-3">
        <img src={avatar} alt={actor} className="h-6 w-6 rounded-full object-cover" />
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{actor}</p>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {action}{" "}
        <Link href={href} className="font-semibold text-primary hover:underline">
          {entity}
        </Link>
      </p>
      <span className="text-[10px] text-slate-400">{time}</span>
    </div>
  );
}
