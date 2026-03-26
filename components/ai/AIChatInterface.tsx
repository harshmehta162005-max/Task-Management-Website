import { useMemo, useRef, useEffect } from "react";
import { AIMessageBubble, ChatMessage } from "./AIMessageBubble";
import { AIComposer } from "./AIComposer";
import { Bot, Lock, FolderOpen, Building2 } from "lucide-react";

type Props = {
  messages: ChatMessage[];
  onSend: (text: string, files?: File[]) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  mode?: "personal" | "project" | "workspace";
};

const MODE_ICONS = {
  personal: Lock,
  project: FolderOpen,
  workspace: Building2,
};

export function AIChatInterface({ messages, onSend, emptyTitle, emptyDescription, mode = "personal" }: Props) {
  const empty = useMemo(() => messages.length === 0, [messages]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const Icon = MODE_ICONS[mode];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white dark:bg-[#111827]">
      <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto p-6">
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
            <div className={`mb-4 rounded-2xl p-4 ${
              mode === "personal" ? "bg-violet-500/10" :
              mode === "project" ? "bg-emerald-500/10" :
              "bg-amber-500/10"
            }`}>
              <Icon className={`h-8 w-8 ${
                mode === "personal" ? "text-violet-500" :
                mode === "project" ? "text-emerald-500" :
                "text-amber-500"
              }`} />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              {emptyTitle ?? "Ask anything…"}
            </p>
            <p className="mt-1 max-w-md text-xs leading-relaxed">
              {emptyDescription ?? "Start a conversation with your AI assistant."}
            </p>
          </div>
        ) : (
          messages.map((m) => <AIMessageBubble key={m.id} message={m} />)
        )}
      </div>
      <AIComposer onSend={onSend} />
    </div>
  );
}
