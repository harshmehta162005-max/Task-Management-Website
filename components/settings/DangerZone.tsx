"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { DeleteWorkspaceModal } from "./DeleteWorkspaceModal";
import { cn } from "@/lib/utils/cn";

type Props = {
  workspaceName: string;
  isAdmin?: boolean;
};

export function DangerZone({ workspaceName, isAdmin = false }: Props) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Critical workspace actions.</p>
      </div>
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-sm dark:border-red-500/20 dark:bg-red-500/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">Delete this workspace</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Once deleted, all projects, tasks, and members will be removed permanently.
              </p>
            </div>
          </div>
          <button
            disabled={!isAdmin || deleted}
            onClick={() => setOpen(true)}
            className={cn(
              "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition",
              !isAdmin
                ? "cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                : deleted
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            )}
          >
            {deleted ? "Deleted" : "Delete workspace"}
          </button>
        </div>
        {!isAdmin && (
          <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Only workspace admins can perform this action.
          </p>
        )}
      </div>
      <DeleteWorkspaceModal
        open={open}
        workspaceName={workspaceName}
        onClose={() => setOpen(false)}
        onConfirm={() => setDeleted(true)}
      />
    </section>
  );
}
