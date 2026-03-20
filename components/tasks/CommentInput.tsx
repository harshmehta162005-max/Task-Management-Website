"use client";

import { Send, Paperclip } from "lucide-react";
import React, { useState } from "react";

type Props = {
  onSubmit: (body: string) => void;
  people: { id: string; name: string }[];
};

export function CommentInput({ onSubmit, people }: Props) {
  const [value, setValue] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onSubmit(v);
    setValue("");
  };

  return (
    <div className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-primary/20 dark:bg-white/5">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            alert("File selected: " + e.target.files[0].name); // Hook this up to real upload if needed
          }
        }}
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="mt-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-300"
      >
        <Paperclip className="h-4 w-4" />
      </button>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        placeholder="Write a comment..."
        className="border-0 focus:ring-0 mt-1 min-h-[24px] w-full resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <button
        onClick={submit}
        disabled={!value.trim()}
        className="mt-0.5 inline-flex items-center justify-center rounded-xl bg-primary p-2 text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
