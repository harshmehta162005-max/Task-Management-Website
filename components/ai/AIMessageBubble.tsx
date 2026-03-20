import { Bot, User } from "lucide-react";
import { SourceCitations } from "./SourceCitations";
import { cn } from "@/lib/utils/cn";

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  sources?: string[];
  loading?: boolean;
};

export function AIMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={cn("max-w-[90%] space-y-2", isUser ? "items-end text-right" : "items-start text-left")}>
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm shadow-sm",
            isUser
              ? "ml-auto rounded-tr-none border-primary/30 bg-primary text-white"
              : "rounded-tl-none border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          )}
        >
          {message.loading ? (
            <span className="animate-pulse text-slate-400">Thinking…</span>
          ) : (
            <p className="leading-relaxed">{message.text}</p>
          )}
          {!isUser && !message.loading && message.sources?.length ? (
            <SourceCitations sources={message.sources} />
          ) : null}
        </div>
      </div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
