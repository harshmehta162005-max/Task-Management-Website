"use client";

import { useState } from "react";
import { UserMinus, UserPlus, Users } from "lucide-react";
import { AddMembersModal } from "./AddMembersModal";

export type ProjectMember = {
  id: string;
  name: string;
  email: string;
  role: "Manager" | "Member";
  avatarUrl?: string;
};

type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  members: ProjectMember[];
  workspaceMembers: WorkspaceMember[];
  onMembersChange: (members: ProjectMember[]) => void;
  isManager: boolean;
};

export function ProjectMembersCard({ members, workspaceMembers, onMembersChange, isManager }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const removeMember = (id: string) => {
    onMembersChange(members.filter((m) => m.id !== id));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Members</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage who can access this project.</p>
          </div>
        </div>
        {isManager && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
          >
            <UserPlus className="h-4 w-4" /> Add members
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img
                src={
                  m.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=0f172a`
                }
                alt={m.name}
                className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-slate-700"
              />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-white/5 dark:text-slate-200"
              >
                {m.role}
              </span>
              {isManager && (
                <button
                  onClick={() => removeMember(m.id)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-white/5"
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {!members.length && (
          <div className="py-6 text-sm text-slate-500 dark:text-slate-400">No members yet. Add your team.</div>
        )}
      </div>

      <AddMembersModal
        open={modalOpen}
        workspaceMembers={workspaceMembers}
        onClose={() => setModalOpen(false)}
        onAdd={(newMembers) =>
          onMembersChange([
            ...members,
            ...newMembers.map((m) => ({ ...m, role: "Member" as const })),
          ])
        }
      />
    </section>
  );
}
