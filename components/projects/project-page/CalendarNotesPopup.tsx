"use client";

import { X, Plus, StickyNote, Globe, Lock } from "lucide-react";

type CalendarNote = {
  id: string;
  date: string;
  content: string;
  isPublic: boolean;
  authorId: string;
  author: { id: string; name: string; avatarUrl?: string | null };
  createdAt?: string;
};

type Props = {
  open: boolean;
  date: string;
  notes: CalendarNote[];
  currentUserId: string;
  isManager: boolean;
  onClose: () => void;
  onAddNew: () => void;
  onEditNote: (note: CalendarNote) => void;
  onViewNote: (note: CalendarNote) => void;
};

function parseContentPreview(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.text === "string") {
      return parsed.text.slice(0, 80) || "(attachment only)";
    }
  } catch {}
  return raw.slice(0, 80) || "Empty note";
}

export function CalendarNotesPopup({
  open,
  date,
  notes,
  currentUserId,
  isManager,
  onClose,
  onAddNew,
  onEditNote,
  onViewNote,
}: Props) {
  if (!open) return null;

  const formattedDate = (() => {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  const handleNoteClick = (note: CalendarNote) => {
    if (note.authorId === currentUserId) {
      onEditNote(note);
    } else {
      onViewNote(note);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
      style={{ animation: "fadeIn 0.15s ease-out" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0f172a] max-h-[70vh] flex flex-col"
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-primary" />
              Notes
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-500/15 hover:text-red-400 dark:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 min-h-0">
          {notes.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
              No notes yet for this date.
            </p>
          )}

          {notes.map((note) => {
            const isOwn = note.authorId === currentUserId;
            const preview = parseContentPreview(note.content);
            const displayName = isOwn ? "My Note" : (note.author.name || "Unknown");

            return (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className="w-full text-left flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3.5 py-3 transition hover:border-primary/30 hover:bg-primary/5 dark:border-slate-700/50 dark:bg-slate-800/30 dark:hover:border-primary/40 dark:hover:bg-primary/10"
              >
                {/* Avatar */}
                <div className="shrink-0 mt-0.5">
                  {note.author.avatarUrl ? (
                    <img
                      src={note.author.avatarUrl}
                      alt={displayName}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                      {isOwn ? "Me" : (note.author.name?.[0]?.toUpperCase() || "?")}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold truncate ${isOwn ? "text-primary" : "text-slate-800 dark:text-slate-200"}`}>
                      {displayName}
                    </span>
                    {note.isPublic ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                        <Globe className="h-2.5 w-2.5" /> Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                        <Lock className="h-2.5 w-2.5" /> Private
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {preview}
                  </p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 mt-1 text-slate-300 dark:text-slate-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Add New Note button */}
        <div className="border-t border-slate-200 px-5 py-3 dark:border-slate-700 shrink-0">
          <button
            onClick={onAddNew}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-primary/40 dark:hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Add New Note
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
