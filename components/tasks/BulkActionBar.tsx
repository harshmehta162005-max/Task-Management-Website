import { useState } from "react";
import { X, Trash2, CheckCircle2, CalendarDays, UserPlus, Tags } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";

type Props = {
  count: number;
  onClear: () => void;
  onAction?: (action: string, payload?: any) => void;
  workspaceMembers?: { id: string; name: string; avatar?: string }[];
};

export function BulkActionBar({ count, onClear, onAction, workspaceMembers = [] }: Props) {
  const [openPopover, setOpenPopover] = useState<"DATE" | "ASSIGN" | "TAG" | null>(null);
  const [dateVal, setDateVal] = useState<Date | undefined>();
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");

  if (count === 0) return null;

  const handleAction = (action: string, payload?: any) => {
    onAction?.(action, payload);
    setOpenPopover(null);
  };

  return (
    <div className="flex items-center justify-between rounded-t-2xl bg-primary/95 px-4 py-3 text-white shadow-lg shadow-primary/30 relative">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">{count} selected</span>
        <div className="hidden gap-3 text-sm font-semibold sm:flex">
          <Action label="Complete" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => handleAction("COMPLETE")} />
          
          {/* ASSIGN POPOVER */}
          <div className="relative">
            <Action label="Assign" icon={<UserPlus className="h-4 w-4" />} onClick={() => setOpenPopover(openPopover === "ASSIGN" ? null : "ASSIGN")} />
            {openPopover === "ASSIGN" && (
              <div className="absolute top-full left-0 mt-2 z-50 rounded-xl bg-white p-3 shadow-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-64 text-slate-800 dark:text-slate-200">
                <p className="text-xs font-bold mb-2 uppercase text-slate-500">Select Assignees</p>
                <div className="max-h-40 overflow-y-auto space-y-1 mb-2">
                  {workspaceMembers.map(m => (
                    <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedAssignees.includes(m.id)} 
                        onChange={e => {
                          if (e.target.checked) setSelectedAssignees([...selectedAssignees, m.id]);
                          else setSelectedAssignees(selectedAssignees.filter(id => id !== m.id));
                        }}
                        className="rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-900"
                      />
                      {m.name}
                    </label>
                  ))}
                  {workspaceMembers.length === 0 && <p className="text-xs text-slate-400">No members found</p>}
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setOpenPopover(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                  <button onClick={() => handleAction("ASSIGN", selectedAssignees)} className="px-3 py-1 bg-primary text-white text-xs rounded font-bold">Apply</button>
                </div>
              </div>
            )}
          </div>

          {/* TAG POPOVER */}
          <div className="relative">
            <Action label="Tag" icon={<Tags className="h-4 w-4" />} onClick={() => setOpenPopover(openPopover === "TAG" ? null : "TAG")} />
            {openPopover === "TAG" && (
              <div className="absolute top-full left-0 mt-2 z-50 rounded-xl bg-white p-3 shadow-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-64 text-slate-800 dark:text-slate-200">
                <p className="text-xs font-bold mb-2 uppercase text-slate-500">Add Tags</p>
                <input 
                   placeholder="e.g. bug, urgent" 
                   value={tagsInput} 
                   onChange={e => setTagsInput(e.target.value)} 
                   className="w-full text-sm rounded border-slate-300 dark:bg-slate-900 dark:border-slate-600 px-2 py-1 mb-2 outline-none focus:ring-1 focus:ring-primary" 
                   onKeyDown={e => {
                     if (e.key === "Enter") {
                        const parsed = tagsInput.split(",").map(t => t.trim()).filter(Boolean).map(name => ({ name }));
                        handleAction("TAG", parsed);
                     }
                   }}
                />
                <p className="text-[10px] text-slate-400 mb-2">Comma separated.</p>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setOpenPopover(null)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                  <button onClick={() => {
                    const parsed = tagsInput.split(",").map(t => t.trim()).filter(Boolean).map(name => ({ name }));
                    handleAction("TAG", parsed);
                  }} className="px-3 py-1 bg-primary text-white text-xs rounded font-bold">Apply</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Action label="Delete" icon={<Trash2 className="h-4 w-4" />} onClick={() => handleAction("DELETE")} />
        <button
          onClick={onClear}
          className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Action({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-semibold transition hover:bg-white/10">
      {icon}
      {label}
    </button>
  );
}

