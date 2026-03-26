"use client";

import { MoreHorizontal, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const ROLES: { value: Role; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "MEMBER", label: "Member" },
];

export function MemberRowActions({ role, status, isAdmin, onChangeRole, onRemove, onResend, onRevoke }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleSub, setRoleSub] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setRoleSub(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => {
          setMenuOpen((v) => !v);
          setRoleSub(false);
        }}
        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-[#0f172a]">
          {/* Change Role */}
          {isAdmin && status === "ACTIVE" && (
            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
                setRoleSub(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setRoleSub(false), 150);
              }}
            >
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Change role
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              {roleSub && (
                <div
                  className="absolute right-full top-0 w-36 rounded-xl border border-slate-200 bg-white py-1 pr-0 shadow-xl dark:border-slate-700 dark:bg-[#0f172a]"
                  onMouseEnter={() => {
                    if (closeTimer.current) clearTimeout(closeTimer.current);
                  }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setRoleSub(false), 150);
                  }}
                >
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => {
                        onChangeRole(r.value);
                        setMenuOpen(false);
                        setRoleSub(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-white/5",
                        r.value === role
                          ? "font-semibold text-primary"
                          : "text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {r.label}
                      {r.value === role && <span className="ml-auto text-xs text-primary">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Invite actions */}
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

          {/* Remove */}
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
