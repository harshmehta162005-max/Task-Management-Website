"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Send } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { useParams } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function InviteMemberModal({ open, onClose }: Props) {
  const params = useParams<{ workspaceSlug: string }>();
  const ws = params?.workspaceSlug ?? "workspace";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open || !ws || ws === "workspace") return;
    fetch(`/api/workspaces/${ws}/roles`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data
            .filter((r: any) => r.name !== "Owner")
            .map((r: any) => ({ value: r.name, label: r.name }));
          setRoles(formatted.length > 0 ? formatted : [{ value: "Member", label: "Member" }]);
          if (formatted.length > 0) setRole(formatted[0].value);
        }
      })
      .catch(() => {
        setRoles([{ value: "Member", label: "Member" }]);
      });
  }, [open, ws]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(null);
      setToast(null);
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => setMounted(true), []);

  const submit = async () => {
    if (!email.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspaces/${ws}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send invite");
      }
      setToast("Invite sent successfully!");
      setTimeout(() => {
        setToast(null);
        onClose();
      }, 1200);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Role</label>
            <Select
              value={role}
              onChange={setRole}
              options={roles.length > 0 ? roles : [{ value: "Member", label: "Member" }]}
              portal={false} 
            />
          </div>
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        </div>
        
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-[#0f172a]/60 rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!email.trim() || isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSubmitting ? "Sending..." : "Send invite"}
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