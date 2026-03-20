"use client";

type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  active?: boolean;
};

type Props = {
  sessions: Session[];
  onSignOut?: (id: string) => void;
};

export function SessionsCard({ sessions, onSignOut }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">🖥️</div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Sessions</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Active sessions</h2>
        </div>
      </div>
      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-[#0f172a]/60"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{s.device}</p>
                {s.active && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-500">
                    Active now
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {s.browser} • {s.location}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Last active: {s.lastActive}</p>
            </div>
            <button
              onClick={() => onSignOut?.(s.id)}
              className="text-sm font-semibold text-slate-500 transition hover:text-red-500"
            >
              Sign out
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
