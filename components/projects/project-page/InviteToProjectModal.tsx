import { useState } from "react";
import { X, Mail, UserPlus } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function InviteToProjectModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111827]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <UserPlus className="h-4 w-4" />
            <h3 className="text-base font-semibold">Invite to project</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-4 py-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-[#0f172a]">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm outline-none dark:text-white"
              placeholder="teammate@company.com"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">UI only — no email will be sent.</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-[#0f172a]/50">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}

