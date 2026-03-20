"use client";

import { Role } from "./InviteMemberCard";
import { MemberRowActions } from "./MemberRowActions";
import { cn } from "@/lib/utils/cn";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "INVITED";
  joinedAt: string;
  avatarUrl?: string;
};

type Props = {
  members: Member[];
  isAdmin: boolean;
  onChangeRole: (id: string, role: Role) => void;
  onRemove: (id: string) => void;
  onResend: (id: string) => void;
  onRevoke: (id: string) => void;
};

const badgeClasses: Record<Role, string> = {
  ADMIN: "bg-indigo-500/10 text-indigo-600 border border-indigo-500/30",
  MANAGER: "bg-purple-500/10 text-purple-600 border border-purple-500/30",
  MEMBER: "bg-slate-500/10 text-slate-600 border border-slate-500/30",
};

export function MembersTable({ members, isAdmin, onChangeRole, onRemove, onResend, onRevoke }: Props) {
  if (!members.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
        No members found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#0d1422] dark:text-slate-400">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        m.avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=0f172a`
                      }
                      alt={m.name}
                      className="h-9 w-9 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                    />
                    <div className="leading-tight">
                      <p className="font-semibold text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{m.email}</td>
                <td className="px-6 py-4">
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", badgeClasses[m.role])}>
                    {m.role === "ADMIN" ? "Admin" : m.role === "MANAGER" ? "Manager" : "Member"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      m.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-amber-500/10 text-amber-600"
                    )}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {m.status === "ACTIVE" ? "Active" : "Invited"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{m.joinedAt}</td>
                <td className="px-6 py-4 text-right">
                  <MemberRowActions
                    role={m.role}
                    status={m.status}
                    isAdmin={isAdmin}
                    onChangeRole={(r) => onChangeRole(m.id, r)}
                    onRemove={() => onRemove(m.id)}
                    onResend={() => onResend(m.id)}
                    onRevoke={() => onRevoke(m.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
