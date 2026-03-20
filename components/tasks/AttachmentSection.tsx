"use client";

import { useRef } from "react";
import { Paperclip, Download, Trash2, Upload } from "lucide-react";
import { DrawerAttachment } from "./task-drawer/types";

type Props = {
  attachments: DrawerAttachment[];
  onAdd: (file: DrawerAttachment) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
};

export function AttachmentSection({ attachments, onAdd, onDelete, readOnly = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const id = crypto.randomUUID();
      const size = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      onAdd({ id, name: file.name, size });
    });
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Attachments ({attachments.length})
        </p>
        {!readOnly && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:text-primary dark:bg-white/5 dark:text-slate-100"
          >
            <Upload className="h-4 w-4" /> Upload
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        />
      </div>
      <div className="space-y-2">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Paperclip className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{att.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{att.size}</p>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              {!readOnly && (
                <button
                  className="rounded-lg p-1 hover:text-red-500"
                  onClick={() => onDelete(att.id)}
                  aria-label="Delete attachment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {!attachments.length && <p className="text-xs text-slate-500 dark:text-slate-400">No attachments yet.</p>}
      </div>
    </div>
  );
}
