import { useMemo } from "react";
import { AIMessageBubble, ChatMessage } from "./AIMessageBubble";
import { AIComposer } from "./AIComposer";

type Props = {
  messages: ChatMessage[];
  onSend: (text: string) => void;
};

export function AIChatInterface({ messages, onSend }: Props) {
  const empty = useMemo(() => messages.length === 0, [messages]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-slate-700 dark:text-slate-200">Ask anything about your workspace…</p>
            <p className="mt-1 max-w-md">Try “What’s blocked in Project Alpha?” or “Summarize this week’s changes”.</p>
          </div>
        ) : (
          messages.map((m) => <AIMessageBubble key={m.id} message={m} />)
        )}
      </div>
      <AIComposer onSend={onSend} />
    </div>
  );
}
