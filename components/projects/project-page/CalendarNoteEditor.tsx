"use client";

import { useState, useRef, useEffect } from "react";
import { X, Bold, Italic, Link2, Code, ImagePlus, FileUp, Trash2, Loader2, Paperclip, Download } from "lucide-react";

type CalendarNote = {
  id: string;
  date: string;
  content: string;
  author: { id: string; name: string; avatarUrl?: string | null };
};

type NoteAttachment = {
  id: string;
  name: string;
  size: string;
  type: "image" | "file";
  data: string; // base64 data URL
};

type NoteContent = {
  text: string;
  attachments: NoteAttachment[];
};

type Props = {
  open: boolean;
  date: string;
  note?: CalendarNote | null;
  onClose: () => void;
  onSave: (date: string, content: string) => Promise<void>;
  onDelete?: (noteId: string) => Promise<void>;
  readOnly?: boolean;
};

function parseNoteContent(raw: string): NoteContent {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.text === "string" && Array.isArray(parsed.attachments)) {
      return parsed;
    }
  } catch {
    // legacy plain text
  }
  return { text: raw || "", attachments: [] };
}

function serializeNoteContent(nc: NoteContent): string {
  return JSON.stringify(nc);
}

export function CalendarNoteEditor({ open, date, note, onClose, onSave, onDelete, readOnly = false }: Props) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (note?.content) {
      const parsed = parseNoteContent(note.content);
      setText(parsed.text);
      setAttachments(parsed.attachments);
    } else {
      setText("");
      setAttachments([]);
    }
  }, [note, open]);

  useEffect(() => {
    if (open && !readOnly) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open, readOnly]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

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

  const insertFormat = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    setText(`${before}${prefix}${selectedText}${suffix}${after}`);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
    }, 0);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, forceType?: "image" | "file") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File must be under 2MB");
      return;
    }

    setUploading(true);
    try {
      const data = await fileToBase64(file);
      const isImage = forceType === "image" || file.type.startsWith("image/");
      const size = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const newAtt: NoteAttachment = {
        id: crypto.randomUUID(),
        name: file.name,
        size,
        type: isImage ? "image" : "file",
        data,
      };

      setAttachments((prev) => [...prev, newAtt]);
    } catch {
      alert("Failed to process file");
    } finally {
      setUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = async () => {
    if (!text.trim() && attachments.length === 0) return;
    setSaving(true);
    try {
      const serialized = serializeNoteContent({ text, attachments });
      await onSave(date, serialized);
      onClose();
    } catch (err: any) {
      console.error("Save failed:", err);
      alert(err?.message || "Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note?.id || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(note.id);
      onClose();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const hasContent = text.trim().length > 0 || attachments.length > 0;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
      style={{ animation: "fadeIn 0.15s ease-out" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0f172a] max-h-[85vh] flex flex-col"
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700 shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {readOnly ? "📝 Note" : note ? "✏️ Edit Note" : "📝 Add Note"}
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

        {/* Body — scrollable */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1 min-h-0">
          {/* Formatting toolbar */}
          {!readOnly && (
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-800/50">
              <ToolbarBtn title="Bold" onClick={() => insertFormat("**", "**")}><Bold className="h-3.5 w-3.5" /></ToolbarBtn>
              <ToolbarBtn title="Italic" onClick={() => insertFormat("*", "*")}><Italic className="h-3.5 w-3.5" /></ToolbarBtn>
              <ToolbarBtn title="Link" onClick={() => insertFormat("[", "](url)")}><Link2 className="h-3.5 w-3.5" /></ToolbarBtn>
              <ToolbarBtn title="Code" onClick={() => insertFormat("`", "`")}><Code className="h-3.5 w-3.5" /></ToolbarBtn>

              <div className="mx-1 h-5 w-px bg-slate-300 dark:bg-slate-600" />

              <ToolbarBtn title="Upload image" onClick={() => imageInputRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              </ToolbarBtn>
              <ToolbarBtn title="Upload file" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <FileUp className="h-3.5 w-3.5" />
              </ToolbarBtn>

              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "image")} />
              <input ref={fileInputRef} type="file" accept="*/*" className="hidden" onChange={(e) => handleUpload(e, "file")} />
            </div>
          )}

          {/* Text area */}
          {readOnly ? (
            <div className="min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm whitespace-pre-wrap text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
              {text || (attachments.length === 0 && "No note content.")}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Write your note for this date..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200 dark:placeholder:text-slate-600"
            />
          )}

          {/* Inline image previews */}
          {attachments.filter((a) => a.type === "image").length > 0 && (
            <div className="space-y-2">
              {attachments.filter((a) => a.type === "image").map((att) => (
                <div key={att.id} className="group relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <img
                    src={att.data}
                    alt={att.name}
                    className="w-full max-h-[200px] object-contain bg-slate-100 dark:bg-slate-900"
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                    <span className="text-xs font-medium text-white truncate">{att.name}</span>
                    <span className="text-[10px] text-white/70">{att.size}</span>
                  </div>
                  {!readOnly && (
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* File attachment boxes — blue style */}
          {attachments.filter((a) => a.type === "file").length > 0 && (
            <div className="space-y-2">
              {attachments.filter((a) => a.type === "file").map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5 text-sm dark:bg-primary/10 dark:border-primary/30"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <div className="flex-1 overflow-hidden min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100 text-sm">{att.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{att.size}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={att.data}
                      download={att.name}
                      className="rounded-lg p-1.5 text-primary/60 hover:text-primary hover:bg-primary/10 transition"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    {!readOnly && (
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {note?.author && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Last edited by <span className="font-semibold">{note.author.name || "Unknown"}</span>
            </p>
          )}
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-700 shrink-0">
            <div>
              {note?.id && onDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 transition hover:text-red-400 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete note
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !hasContent}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {note ? "Update" : "Save Note"}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

function ToolbarBtn({ children, title, onClick, disabled }: { children: React.ReactNode; title: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded p-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
      title={title}
    >
      {children}
    </button>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
