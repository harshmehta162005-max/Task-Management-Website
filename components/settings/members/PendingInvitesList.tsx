"use client";

import { Mail } from "lucide-react";
import { Role } from "./InviteMemberCard";
import { cn } from "@/lib/utils/cn";

export type Invite = {
  id: string;
  email: string;
  role: Role;
  invitedAt: string;
};

type Props = {
  invites: Invite[];
  onResend: (id: string) => void;
  onRevoke: (id: string) => void;
};

export function PendingInvitesList({ invites, onResend, onRevoke }: Props) {
  if (!invites.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
        No pending invites.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pending invites</h3>
      <div className="space-y-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between dark:border-slate-800 dark:bg-[#0d1422]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-slate-900 dark:text-white">{invite.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Invited as {roleLabel(invite.role)} • {invite.invitedAt}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onResend(invite.id)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Resend
              </button>
              <button
                onClick={() => onRevoke(invite.id)}
                className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function roleLabel(role: Role) {
  if (role === "ADMIN") return "Admin";
  if (role === "MANAGER") return "Manager";
  return "Member";
}
