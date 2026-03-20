"use client";

import { Bold, Italic, Link as LinkIcon, List } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  description: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
};

export function DescriptionEditor({ description, onChange, readOnly = false }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Ref flag to prevent blur from closing while toolbar is being clicked
  const isToolbarClickRef = useRef(false);

  const applyFormat = useCallback((prefix: string, suffix: string = "") => {
    if (readOnly) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end);
    const before = description.substring(0, start);
    const after = description.substring(end);

    const newText = before + prefix + selectedText + suffix + after;
    onChange(newText);

    // Re-focus and restore cursor position after React re-renders
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorStart = start + prefix.length;
        const newCursorEnd = end + prefix.length;
        textareaRef.current.setSelectionRange(newCursorStart, newCursorEnd);
      }
    });
  }, [description, onChange, readOnly]);

  const handleEditStart = () => {
    if (readOnly) return;
    setIsEditing(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleBlur = () => {
    // Wait to check if a toolbar button was clicked
    setTimeout(() => {
      if (!isToolbarClickRef.current) {
        setIsEditing(false);
      }
      isToolbarClickRef.current = false;
    }, 200);
  };

  const handleToolbarMouseDown = (e: React.MouseEvent, prefix: string, suffix: string = "") => {
    e.preventDefault();
    e.stopPropagation();
    isToolbarClickRef.current = true;
    applyFormat(prefix, suffix);
    // Reset the flag after a short delay
    setTimeout(() => {
      isToolbarClickRef.current = false;
    }, 300);
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</p>
      <div className="overflow-hidden rounded-2xl bg-slate-50 dark:bg-white/5">
        {isEditing ? (
          <>
            <div className="flex items-center gap-1 border-b border-slate-100 px-2 py-2 dark:border-white/5">
              <ToolbarButton label="Bold" icon={<Bold className="h-4 w-4" />} onMouseDown={(e) => handleToolbarMouseDown(e, "**", "**")} />
              <ToolbarButton label="Italic" icon={<Italic className="h-4 w-4" />} onMouseDown={(e) => handleToolbarMouseDown(e, "*", "*")} />
              <ToolbarButton label="Link" icon={<LinkIcon className="h-4 w-4" />} onMouseDown={(e) => handleToolbarMouseDown(e, "[", "](url)")} />
              <ToolbarButton label="List" icon={<List className="h-4 w-4" />} onMouseDown={(e) => handleToolbarMouseDown(e, "- ", "")} />
            </div>
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              rows={5}
              className="border-0 focus:ring-0 w-full resize-y bg-transparent px-4 py-3 text-sm text-slate-900 outline-none dark:text-slate-100"
              placeholder="Add details, context, and links..."
            />
          </>
        ) : (
          <div
            className={`min-h-[80px] w-full px-4 py-3 text-sm ${!readOnly ? "cursor-text hover:bg-slate-100 dark:hover:bg-white/10 transition" : ""}`}
            onClick={handleEditStart}
          >
            {description ? (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-strong:font-bold prose-em:italic prose-a:text-blue-500 prose-a:underline prose-ul:list-disc prose-ol:list-decimal">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
              </div>
            ) : (
              <span className="text-slate-400 italic">{readOnly ? "No description." : "Click to add description..."}</span>
            )}
          </div>
        )}
      </div>
      {isEditing && <p className="text-xs text-slate-400">Markdown supported. Click outside to preview.</p>}
    </div>
  );
}

function ToolbarButton({ icon, onMouseDown, label }: { icon: React.ReactNode; onMouseDown: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      title={label}
      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-slate-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {icon}
    </button>
  );
}
