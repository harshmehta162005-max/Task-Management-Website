"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function TaskDrawerShell({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close task drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />
      <div
        className={cn(
          "relative h-full w-full max-w-[520px] bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 shadow-2xl",
          "animate-[slideIn_.2s_ease] md:rounded-l-2xl"
        )}
      >
        {children}
      </div>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
