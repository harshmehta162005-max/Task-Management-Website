"use client";

import { Paperclip, Send, X, FileText } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  onSend: (text: string, files?: File[]) => void;
  preset?: string;
  disabled?: boolean;
};

export function AIComposer({ onSend, preset, disabled }: Props) {
  const [text, setText] = useState(preset ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    const val = text.trim();
    if (!val && files.length === 0) return;
    onSend(val, files.length > 0 ? files : undefined);
    setText("");
    setFiles([]);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    const newHeight = Math.min(target.scrollHeight, 160);
    target.style.height = `${newHeight}px`;
    target.style.overflowY = target.scrollHeight > 160 ? "auto" : "hidden";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasContent = text.trim().length > 0 || files.length > 0;

  return (
    <div className="bg-slate-50/70 p-3 dark:bg-[#0b1220]">
      {/* File previews */}
      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300"
            >
              <FileText className="h-3 w-3 text-primary" />
              <span className="max-w-[120px] truncate">{f.name}</span>
              <span className="text-[10px] text-slate-400">
                {f.size < 1024 ? `${f.size}B` : `${(f.size / 1024).toFixed(0)}KB`}
              </span>
              <button
                onClick={() => removeFile(i)}
                className="ml-0.5 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500 dark:hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 rounded-xl bg-transparent px-3 py-2">
        {/* File upload button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.md,.csv,.json,.pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300"
          title="Attach files"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          rows={1}
          disabled={disabled}
          placeholder="Ask anything… (Shift+Enter for new line)"
          className="
  flex-1 resize-none overflow-y-hidden bg-transparent py-1 text-sm
  text-slate-900 placeholder:text-slate-400
  disabled:opacity-50 dark:text-slate-100
  resize-none overflow-hidden
  outline-none focus:outline-none
  ring-0 focus:ring-0 focus:ring-offset-0
  border-0 focus:border-0
  [&::-webkit-scrollbar]:hidden
  [-ms-overflow-style:none] [scrollbar-width:none]
"
          style={{ minHeight: "24px", maxHeight: "160px" }}
        />

        {/* Send button */}
        <button
          onClick={send}
          disabled={!hasContent || disabled}
          className={`shrink-0 rounded-lg p-2 transition ${hasContent && !disabled
            ? "bg-primary text-white shadow-sm hover:bg-primary/90"
            : "text-slate-300 dark:text-slate-600"
            }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
