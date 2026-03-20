"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ScopeSelector, ScopeValue } from "@/components/ai/ScopeSelector";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { SuggestedPrompts } from "@/components/ai/SuggestedPrompts";
import { MeetingToTasksFlow } from "@/components/ai/MeetingToTasksFlow";
import { WeeklySummaryTrigger } from "@/components/ai/WeeklySummaryTrigger";
import type { ChatMessage } from "@/components/ai/AIMessageBubble";

const projects = [
  { id: "mobile", name: "Mobile Redesign" },
  { id: "api", name: "API Documentation" },
  { id: "marketing", name: "Q4 Marketing" },
];

export default function AIPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const [scope, setScope] = useState<ScopeValue>("workspace");
  const [projectId, setProjectId] = useState(projects[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = (text: string) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: sampleResponse(text),
          sources: ["Task #42", "Comment by Sarah", "Project Alpha"],
        },
      ]);
      setIsThinking(false);
    }, 700);
  };

  const scopedLabel = useMemo(() => {
    if (scope === "workspace") return "Entire Workspace";
    if (scope === "my-tasks") return "My Tasks Only";
    const proj = projects.find((p) => p.id === projectId);
    return proj ? proj.name : "Specific Project";
  }, [scope, projectId]);

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Assistant</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask questions, summarize work, and turn notes into tasks. Scope: {scopedLabel}
          </p>
        </div>
        <div className="w-full max-w-sm">
          <ScopeSelector
            scope={scope}
            projectId={projectId}
            projects={projects}
            onScopeChange={setScope}
            onProjectChange={setProjectId}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 flex flex-col gap-4 min-h-[640px]">
          <AIChatInterface
            messages={[
              ...messages,
              ...(isThinking ? [{ id: "thinking", role: "ai", text: "", loading: true } as ChatMessage] : []),
            ]}
            onSend={sendMessage}
          />
          <SuggestedPrompts onSelect={sendMessage} />
        </section>

        <aside className="lg:col-span-4 space-y-4">
          <MeetingToTasksFlow />
          <WeeklySummaryTrigger projects={projects} />
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#111827] dark:text-slate-400">
            AI Core v4.2 • Workspace: {workspaceSlug}
          </div>
        </aside>
      </div>
    </main>
  );
}

function sampleResponse(prompt: string) {
  if (prompt.toLowerCase().includes("blocked")) {
    return '2 tasks are blocked: "OAuth integration" (waiting on credentials) and "Legal review" (need approval).';
  }
  if (prompt.toLowerCase().includes("overloaded")) {
    return "Sarah is at 92% load and Marcus at 78%. Consider rebalancing QA tasks.";
  }
  return "Here’s a quick summary: 12 tasks done this week, 3 high-priority items in progress, and 1 blocker awaiting review.";
}
