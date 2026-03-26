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

  // Simple markdown-like formatting for AI responses
  const formatText = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bullet points
      if (line.match(/^[-•*]\s/)) {
        return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-40" />
            <span>{formatInline(line.replace(/^[-•*]\s/, ""))}</span>
          </div>
        );
      }
      // Numbered list
      if (line.match(/^\d+[.)]\s/)) {
        return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="flex-shrink-0 font-semibold opacity-60">{line.match(/^\d+/)?.[0]}.</span>
            <span>{formatInline(line.replace(/^\d+[.)]\s/, ""))}</span>
          </div>
        );
      }
      // Headers (## or #)
      if (line.match(/^#{1,3}\s/)) {
        const cleaned = line.replace(/^#{1,3}\s/, "");
        return <p key={i} className="font-bold mt-2 first:mt-0">{cleaned}</p>;
      }
      // Empty line
      if (!line.trim()) return <br key={i} />;
      // Normal text
      return <p key={i} className="py-0.5">{formatInline(line)}</p>;
    });
  };

  // Bold and inline code formatting
  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono dark:bg-slate-800">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={cn("max-w-[85%] space-y-2", isUser ? "items-end text-right" : "items-start text-left")}>
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm shadow-sm",
            isUser
              ? "ml-auto rounded-tr-none border-primary/30 bg-primary text-white"
              : "rounded-tl-none border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100"
          )}
        >
          {message.loading ? (
            <div className="flex items-center gap-2">
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary/50 [animation-delay:300ms]" />
              </span>
              <span className="text-slate-400 text-xs">Thinking…</span>
            </div>
          ) : isUser ? (
            <p className="leading-relaxed">{message.text}</p>
          ) : (
            <div className="leading-relaxed">{formatText(message.text)}</div>
          )}
          {!isUser && !message.loading && message.sources?.length ? (
            <SourceCitations sources={message.sources} />
          ) : null}
        </div>
      </div>
      {isUser && (
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
