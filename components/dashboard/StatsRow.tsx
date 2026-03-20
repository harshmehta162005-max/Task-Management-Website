import { Activity, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { StatCard } from "./StatCard";

type Stat = {
  label: string;
  value: string | number;
  delta?: string;
  deltaColor?: "green" | "red" | "slate";
  icon: any;
};

const iconMap = {
  total: CheckCircle2,
  overdue: AlertTriangle,
  blocked: Activity,
  today: Calendar,
};

type Props = {
  stats: Stat[];
};

export function StatsRow({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          delta={stat.delta}
          deltaColor={stat.deltaColor}
          icon={stat.icon || iconMap.total}
        />
      ))}
    </div>
  );
}
