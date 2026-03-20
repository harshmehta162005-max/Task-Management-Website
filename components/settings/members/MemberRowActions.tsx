"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { RoleChangeDropdown } from "./RoleChangeDropdown";
import { Role } from "./InviteMemberCard";
import { cn } from "@/lib/utils/cn";

type Props = {
  role: Role;
  status: "ACTIVE" | "INVITED";
  isAdmin: boolean;
  onChangeRole: (role: Role) => void;
  onRemove: () => void;
  onResend?: () => void;
  onRevoke?: () => void;
};

export function MemberRowActions({ role, status, isAdmin, onChangeRole, onRemove, onResend, onRevoke }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-end gap-2">
      <RoleChangeDropdown role={role} disabled={!isAdmin} onChange={onChangeRole} />
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-10 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-[#0f172a]">
          {status === "INVITED" && (
            <>
              <button
                onClick={() => {
                  onResend?.();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Resend invite
              </button>
              <button
                onClick={() => {
                  onRevoke?.();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Revoke invite
              </button>
            </>
          )}
          {status === "ACTIVE" && (
            <button
              disabled={!isAdmin}
              onClick={() => {
                if (!isAdmin) return;
                onRemove();
                setMenuOpen(false);
              }}
              className={cn(
                "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-500/10",
                isAdmin ? "text-red-500 dark:text-red-400" : "cursor-not-allowed text-slate-400"
              )}
            >
              Remove member
            </button>
          )}
        </div>
      )}
    </div>
  );
}
