"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Wand2 } from "lucide-react";
import { ProposedTasksList } from "./ProposedTasksList";
import { Select } from "@/components/ui/Select";

type Props = {
  open: boolean;
  onClose: () => void;
};

const projects = [
  { id: "ops", name: "Internal Operations" },
  { id: "acme", name: "Client: Acme Corp" },
];

export function ExtractTasksFromNotesModal({ open, onClose }: Props) {
  const [notes, setNotes] = useState("");
  const [projectId, setProjectId] = useState(projects[0].id);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<{ id: string; title: string; approved: boolean }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) {
      setNotes("");
      setTasks([]);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => setMounted(true), []);

  const extract = () => {
    setLoading(true);
    setTimeout(() => {
      setTasks([
        { id: "p1", title: "Update homepage hero copy", approved: true },
        { id: "p2", title: "Schedule follow-up with stakeholders", approved: false },
        { id: "p3", title: "Prepare design handoff deck", approved: false },
      ]);
      setLoading(false);
    }, 700);
  };

  const approveAll = () => setTasks((prev) => prev.map((t) => ({ ...t, approved: true })));
  const toggle = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t)));

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm sm:items-center">
      
      {/* 1. Removed overflow-hidden */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0f172a]">
        
        {/* 2. Added rounded-t-2xl */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 rounded-t-2xl">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Paste notes → Extract tasks</h3>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* 3. Removed max-h-[70vh] overflow-y-auto */}
        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Meeting notes / transcript</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
              placeholder="Paste your meeting notes…"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Target project</label>
            <Select
              value={projectId}
              onChange={setProjectId}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              portal={false}
            />
          </div>
          <ProposedTasksList tasks={tasks} onToggle={toggle} onApproveAll={approveAll} />
        </div>
        
        {/* 4. Added rounded-b-2xl */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm dark:border-slate-800 dark:bg-[#0f172a]/60 rounded-b-2xl">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            AI typically extracts tasks in &lt; 2 seconds (placeholder)
          </span>
          <button
            onClick={extract}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-60"
          >
            <Wand2 className="h-4 w-4" /> {loading ? "Extracting…" : "Extract"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}