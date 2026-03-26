"use client";

import { useState } from "react";
import { Plus, MessageSquare, Pencil, Trash2, Check, X, MoreHorizontal } from "lucide-react";

export type ChatSession = {
  id: string;
  name: string;
  mode: string;
  projectId: string | null;
  updatedAt: string;
  messageCount: number;
  lastMessage: string | null;
  lastRole: string | null;
};

type Props = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (sessionId: string) => void;
  onCreate: (name: string) => void;
  onRename: (sessionId: string, name: string) => void;
  onDelete: (sessionId: string) => void;
  mode: string;
};

export function ChatSessionsSidebar({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  mode,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    onCreate(name);
    setNewName("");
    setIsCreating(false);
  };

  const handleRename = (id: string) => {
    const name = editName.trim();
    if (!name) return;
    onRename(id, name);
    setEditingId(null);
    setEditName("");
  };

  const modeColors: Record<string, string> = {
    personal: "bg-violet-500",
    project: "bg-emerald-500",
    workspace: "bg-amber-500",
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Chats
        </h3>
        <button
          onClick={() => { setIsCreating(true); setNewName(""); }}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          <Plus className="h-3 w-3" />
          New
        </button>
      </div>

      {/* New chat input */}
      {isCreating && (
        <div className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setIsCreating(false);
            }}
            placeholder="Name your chat…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          />
          <div className="mt-2 flex gap-1.5">
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[11px] font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              <Check className="h-3 w-3" /> Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] font-semibold text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <MessageSquare className="mb-2 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="text-xs text-slate-400 dark:text-slate-500">
              No chats yet.{" "}
              <button
                onClick={() => { setIsCreating(true); setNewName(""); }}
                className="font-semibold text-primary hover:underline"
              >
                Start one
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 p-1.5">
            {sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const isEditing = editingId === s.id;

              return (
                <div
                  key={s.id}
                  className={`group relative rounded-xl px-3 py-2.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-100 dark:bg-white/5"
                      : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  }`}
                  onClick={() => { if (!isEditing) onSelect(s.id); }}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${modeColors[s.mode] ?? "bg-slate-400"}`} />
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(s.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-600 dark:bg-[#0f172a] dark:text-slate-100"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRename(s.id); }}
                            className="text-primary hover:text-primary/80"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                          {s.name}
                        </p>
                      )}
                      {s.lastMessage && !isEditing && (
                        <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
                          {s.lastRole === "user" ? "You: " : "AI: "}
                          {s.lastMessage}
                        </p>
                      )}
                      <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                        {formatTime(s.updatedAt)}{s.messageCount > 0 ? ` · ${s.messageCount} msgs` : ""}
                      </p>
                    </div>

                    {/* Actions menu */}
                    {!isEditing && (
                      <div className="relative shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === s.id ? null : s.id);
                          }}
                          className={`rounded-md p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300 ${
                            isActive || menuOpenId === s.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                        {menuOpenId === s.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-[#1a2332]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(s.id);
                                setEditName(s.name);
                                setMenuOpenId(null);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                              <Pencil className="h-3 w-3" /> Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(s.id);
                                setMenuOpenId(null);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
