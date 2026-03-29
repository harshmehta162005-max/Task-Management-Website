"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, LayoutDashboard, Sparkles, UserPlus, User } from "lucide-react";
import { CreatePersonalTaskModal } from "./CreatePersonalTaskModal";
import { CreateProjectModalWrapper } from "./CreateProjectModalWrapper";
import { ExtractTasksFromNotesModal } from "./ExtractTasksFromNotesModal";
import { InviteMemberModal } from "./InviteMemberModal";

type ActionKey = "personal-task" | "project" | "extract" | "invite";

export function QuickCreateMenu() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ActionKey | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setActive(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const actions = useMemo(
    () => [
      {
        key: "personal-task" as const,
        label: "Personal Task",
        description: "Add a task just for yourself",
        icon: User,
      },
      {
        key: "project" as const,
        label: "Create Project",
        description: "Start a new project",
        icon: LayoutDashboard,
      },
      {
        key: "extract" as const,
        label: "Paste Notes → Extract Tasks",
        description: "Turn meeting notes into tasks",
        icon: Sparkles,
      },
      {
        key: "invite" as const,
        label: "Invite Member",
        description: "Bring collaborators",
        icon: UserPlus,
      },
    ],
    []
  );

  const handleSelect = (key: ActionKey) => {
    setActive(key);
    setOpen(false);
  };

  return (
    <>
      <div className="relative z-50" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          aria-label="Open quick create"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:block">Create</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:border-slate-700 dark:bg-[#0f172a] z-50">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={() => handleSelect(action.key)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <action.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CreatePersonalTaskModal open={active === "personal-task"} onClose={() => setActive(null)} />
      <CreateProjectModalWrapper open={active === "project"} onClose={() => setActive(null)} />
      <ExtractTasksFromNotesModal open={active === "extract"} onClose={() => setActive(null)} />
      <InviteMemberModal open={active === "invite"} onClose={() => setActive(null)} />
    </>
  );
}
