import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  preset?: string;
};

export function AIComposer({ onSend, preset }: Props) {
  const [text, setText] = useState(preset ?? "");

  const send = () => {
    const val = text.trim();
    if (!val) return;
    onSend(val);
    setText("");
  };

  return (
    <div className="border-t border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-[#0b1220]">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Ask anything..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-28 text-sm text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10">
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            onClick={send}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Send <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

