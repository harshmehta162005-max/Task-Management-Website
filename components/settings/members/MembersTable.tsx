"use client";

import { useState } from "react";
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

/* ── Hover Tooltip ───────────────────────────────────────────── */
function HoverTip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex max-w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && text && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-lg dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-100">
          {text}
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1e293b]" />
        </span>
      )}
    </span>
  );
}

/* ── Format date compactly ───────────────────────────────────── */
function fmtDate(raw: string) {
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
  } catch {
    return raw;
  }
}

/* ── Table ───────────────────────────────────────────────────── */
export function MembersTable({ members, isAdmin, onChangeRole, onRemove, onResend, onRevoke }: Props) {
  if (!members.length) {
    return (
      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
        No members found.
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <table className="w-full table-fixed text-left text-sm">
        <colgroup>
          <col style={{ width: "26%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
        </colgroup>
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-[#0d1422] dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {members.map((m) => (
            <tr key={m.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
              {/* USER */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={
                      m.avatarUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=0f172a`
                    }
                    alt={m.name}
                    className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <HoverTip text={m.name}>
                    <span className="truncate font-semibold text-slate-900 dark:text-white">{m.name}</span>
                  </HoverTip>
                </div>
              </td>

              {/* EMAIL */}
              <td className="px-4 py-3">
                <HoverTip text={m.email}>
                  <span className="block truncate text-slate-600 dark:text-slate-300">
                    {m.email}
                  </span>
                </HoverTip>
              </td>

              {/* ROLE */}
              <td className="px-4 py-3">
                <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", badgeClasses[m.role])}>
                  {m.role === "ADMIN" ? "Admin" : m.role === "MANAGER" ? "Manager" : "Member"}
                </span>
              </td>

              {/* STATUS */}
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold",
                    m.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-amber-500/10 text-amber-600"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {m.status === "ACTIVE" ? "Active" : "Invited"}
                </span>
              </td>

              {/* JOINED */}
              <td className="px-4 py-3">
                <HoverTip text={m.joinedAt}>
                  <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {fmtDate(m.joinedAt)}
                  </span>
                </HoverTip>
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-3 text-right">
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
  );
}
