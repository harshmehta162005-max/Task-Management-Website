import Link from "next/link";

type MemberLoad = {
  name: string;
  load: number; // 0-100
};

type Props = {
  members: MemberLoad[];
  href: string;
};

export function WorkloadHeatmap({ members, href }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Workload Heatmap</h2>
        <Link href={href} className="text-sm font-semibold text-primary">
          View all members
        </Link>
      </div>
      <div className="space-y-5">
        {members.map((member) => (
          <div key={member.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-900 dark:text-slate-100">{member.name}</span>
              <span className="text-slate-500 dark:text-slate-400">{member.load}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, member.load)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
