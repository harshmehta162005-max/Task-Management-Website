"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Select } from "@/components/ui/Select";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function InviteMemberModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setRole("Member");
      setToast(null);
    }
  }, [open]);

  useEffect(() => setMounted(true), []);

  const submit = () => {
    if (!email.trim()) return;
    setToast("Invite sent");
    setTimeout(() => {
      setToast(null);
      onClose();
    }, 800);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm sm:items-center">
      
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Invite member</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
              type="email"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Role</label>
            <Select
              value={role}
              onChange={setRole}
              options={[
                { value: "Member", label: "Member" },
                { value: "Manager", label: "Manager" },
                { value: "Admin", label: "Admin" },
              ]}
              portal={false} 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-[#0f172a]/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            Send invite
          </button>
        </div>
        {toast && (
          <div className="absolute bottom-4 right-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
            {toast}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}