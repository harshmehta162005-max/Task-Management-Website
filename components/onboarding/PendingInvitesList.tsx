import { X } from "lucide-react";

type Invite = { email: string; role: "Member" | "Manager" };

type Props = {
  invites: Invite[];
  onRemove: (email: string) => void;
};

export function PendingInvitesList({ invites, onRemove }: Props) {
  if (!invites.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No pending invites.</p>;
  }

  return (
    <ul className="space-y-2">
      {invites.map((inv) => (
        <li
          key={inv.email}
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              {inv.email[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{inv.email}</p>
              <p className="text-xs text-slate-500">{inv.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(inv.email)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
            aria-label={`Remove ${inv.email}`}
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
