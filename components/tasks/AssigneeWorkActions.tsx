"use client";

import { useTransition } from "react";
import { CheckCircle2, Play, AlertCircle } from "lucide-react";

export type AssigneeWorkStatus = "TODO" | "IN_PROGRESS" | "SUBMITTED";

type Props = {
  taskId: string;
  userId: string;
  workStatus: AssigneeWorkStatus;
  workspaceSlug: string;
  onStatusUpdated: (newStatus: AssigneeWorkStatus) => void;
  onTaskStatusDerived?: (newTaskStatus: string) => void;
};

export function AssigneeWorkActions({ taskId, userId, workStatus, workspaceSlug, onStatusUpdated, onTaskStatusDerived }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (newStatus: AssigneeWorkStatus) => {
    startTransition(async () => {
      onStatusUpdated(newStatus); // Optimistic UI update
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            updateAssigneeWorkStatus: true,
            userId,
            workStatus: newStatus, 
            workspaceSlug 
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Failed to update status", errData);
          alert(errData.error || "Failed to update work status. Please ensure your backend is running.");
        } else {
          const resData = await res.json();
          if (resData.newTaskStatus && onTaskStatusDerived) {
            onTaskStatusDerived(resData.newTaskStatus);
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (workStatus === "TODO") {
    return (
      <button 
        onClick={() => handleUpdate("IN_PROGRESS")} 
        disabled={isPending}
        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 rounded-xl transition-all px-4 py-2 font-medium disabled:opacity-50"
      >
        <Play className="h-4 w-4" /> Start Work
      </button>
    );
  }

  if (workStatus === "IN_PROGRESS") {
    return (
      <button 
        onClick={() => handleUpdate("SUBMITTED")} 
        disabled={isPending}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-xl transition-all px-4 py-2 font-medium disabled:opacity-50"
      >
        <CheckCircle2 className="h-4 w-4" /> Submit Work
      </button>
    );
  }

  if (workStatus === "SUBMITTED") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200/50 w-full sm:w-auto dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20">
        <AlertCircle className="h-4 w-4" /> Waiting for Owner Review...
      </div>
    );
  }

  return null;
}
