import { TemplateCard } from "./TemplateCard";
import { Clock4, BellOff, AlertTriangle, FileText } from "lucide-react";

export type AutomationTemplateKey = "dueSoon" | "blocked" | "stale" | "weekly";

const templates = [
  {
    key: "dueSoon" as AutomationTemplateKey,
    title: "Due soon reminder",
    description: "Ping owners before tasks hit their due dates.",
    icon: <Clock4 className="h-4 w-4" />,
  },
  {
    key: "blocked" as AutomationTemplateKey,
    title: "Blocked task alert",
    description: "Notify managers when status changes to Blocked.",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    key: "stale" as AutomationTemplateKey,
    title: "Stale task nudge",
    description: "Nudge assignees when no updates for a while.",
    icon: <BellOff className="h-4 w-4" />,
  },
  {
    key: "weekly" as AutomationTemplateKey,
    title: "Weekly summary",
    description: "Send a weekly project digest to stakeholders.",
    icon: <FileText className="h-4 w-4" />,
  },
];

export function TemplatesRow({ onUse }: { onUse: (key: AutomationTemplateKey) => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {templates.map((t) => (
        <TemplateCard
          key={t.key}
          icon={t.icon}
          title={t.title}
          description={t.description}
          onUse={() => onUse(t.key)}
        />
      ))}
    </div>
  );
}
