import { Users } from "lucide-react";

type Item = { title: string; detail: string };
type Member = { name: string };

type Props = {
  overdue: Item[];
  blocked: Item[];
  overloaded: Member[];
};

export function AttentionPanel({ overdue, blocked, overloaded }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="border-b border-slate-200 p-6 dark:border-white/10">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Attention Panel</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        <Column title="Overdue Tasks" color="bg-rose-500" items={overdue} />
        <Column title="Blocked" color="bg-amber-500" items={blocked} />
        <OverloadedColumn members={overloaded} />
      </div>
    </div>
  );
}

function Column({ title, color, items }: { title: string; color: string; items: Item[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-3">
          <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</span>
        </div>
      ))}
      {!items.length && <p className="text-xs text-slate-500">All clear</p>}
    </div>
  );
}

function OverloadedColumn({ members }: { members: Member[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overloaded</h3>
      {members.map((m) => (
        <div key={m.name} className="flex items-center gap-3">
          <Users className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{m.name}</span>
        </div>
      ))}
      {!members.length && <p className="text-xs text-slate-500">No overloads</p>}
    </div>
  );
}
