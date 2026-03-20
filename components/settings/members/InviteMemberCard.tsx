"use client";

import { useState } from "react";
import { MailPlus } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Props = {
  onInvite: (email: string, role: Role) => void;
};

export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export function InviteMemberCard({ onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("MEMBER");
  const [sent, setSent] = useState(false);

  const send = () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    onInvite(trimmed, role);
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MailPlus className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Invite member</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Send an invite to join this workspace.</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@company.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
        />
        <Select
          value={role}
          onChange={(v) => setRole(v as Role)}
          options={[
            { value: "MEMBER", label: "Member" },
            { value: "MANAGER", label: "Manager" },
            { value: "ADMIN", label: "Admin" },
          ]}
          className="md:w-48"
          portal={false}
        />
        <button
          onClick={send}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          Send invite
        </button>
      </div>
      {sent && <p className="mt-3 text-xs font-semibold text-emerald-500">Invite sent</p>}
    </div>
  );
}
