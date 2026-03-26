"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { User, FolderOpen, Building2, Lock, Sparkles, Trash2 } from "lucide-react";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { SuggestedPrompts } from "@/components/ai/SuggestedPrompts";
import { MeetingToTasksFlow } from "@/components/ai/MeetingToTasksFlow";
import { WeeklySummaryTrigger } from "@/components/ai/WeeklySummaryTrigger";
import type { ChatMessage } from "@/components/ai/AIMessageBubble";
import { Select } from "@/components/ui/Select";

type ChatMode = "personal" | "project" | "workspace";
type Project = { id: string; name: string };

const MODE_CONFIG = {
  personal: {
    icon: User,
    label: "Personal",
    accent: "from-violet-500 to-purple-600",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-500",
    border: "border-violet-500/30",
    description: "Private brainstorming, drafting & learning",
    emptyTitle: "Your personal AI assistant",
    emptyDesc: "Brainstorm ideas, draft messages, or ask anything. This chat is private — only you can see it.",
  },
  project: {
    icon: FolderOpen,
    label: "Project",
    accent: "from-emerald-500 to-teal-600",
    accentBg: "bg-emerald-500/10",
    accentText: "text-emerald-500",
    border: "border-emerald-500/30",
    description: "Shared project assistant with real-time data",
    emptyTitle: "Project AI Assistant",
    emptyDesc: "Ask about tasks, blockers, workload, or project status. I have access to this project's real-time data.",
  },
  workspace: {
    icon: Building2,
    label: "Workspace",
    accent: "from-amber-500 to-orange-600",
    accentBg: "bg-amber-500/10",
    accentText: "text-amber-500",
    border: "border-amber-500/30",
    description: "Strategic insights across all projects",
    emptyTitle: "Workspace Strategic Assistant",
    emptyDesc: "Get cross-project insights, team performance analysis, and executive summaries. Admin access only.",
  },
} as const;

export default function AIPage() {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const [mode, setMode] = useState<ChatMode>("personal");
  const [projectId, setProjectId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [workspaceId, setWorkspaceId] = useState("");
  const historyLoadedFor = useRef("");

  // Fetch workspace info + admin status
  useEffect(() => {
    if (!workspaceSlug) return;
    fetch(`/api/workspaces/${workspaceSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setWorkspaceId(data.id);
          setIsAdmin(!!data.isAdmin || !!data.isOwner);
        }
      })
      .catch(console.error);
  }, [workspaceSlug]);

  // Fetch projects
  useEffect(() => {
    if (!workspaceSlug) return;
    fetch(`/api/projects?workspaceSlug=${workspaceSlug}`)
      .then((r) => r.json())
      .then((data) => {
        const list: Project[] = Array.isArray(data) ? data : data?.projects ?? [];
        setProjects(list);
        if (list[0]) setProjectId(list[0].id);
      })
      .catch(console.error);
  }, [workspaceSlug]);

  // Load chat history for current mode
  useEffect(() => {
    if (!workspaceSlug) return;
    const key = `${mode}-${projectId}`;
    if (historyLoadedFor.current === key) return;
    historyLoadedFor.current = key;

    const params = new URLSearchParams({
      workspaceSlug,
      mode,
      ...(mode === "project" && projectId ? { projectId } : {}),
    });

    fetch(`/api/ai/ask?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.history)) {
          const loaded: ChatMessage[] = data.history.map(
            (m: { id: string; role: string; content: string }) => ({
              id: m.id,
              role: m.role === "user" ? "user" : "ai",
              text: m.content,
            })
          );
          setMessages(loaded);
        } else {
          setMessages([]);
        }
      })
      .catch(() => setMessages([]));
  }, [workspaceSlug, mode, projectId]);

  // Switch mode — reset history tracking so it reloads
  const switchMode = useCallback((newMode: ChatMode) => {
    setMode(newMode);
    setMessages([]);
    historyLoadedFor.current = "";
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!workspaceSlug) return;
      if (mode === "project" && !projectId) return;

      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      try {
        const res = await fetch("/api/ai/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceSlug,
            message: text,
            mode,
            projectId: mode === "project" ? projectId : undefined,
          }),
        });

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "ai",
            text: data.reply ?? data.error ?? "No response",
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "ai", text: "Something went wrong. Please try again." },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [workspaceSlug, mode, projectId]
  );

  const clearHistory = useCallback(async () => {
    if (!workspaceSlug) return;
    const params = new URLSearchParams({
      workspaceSlug,
      mode,
      ...(mode === "project" && projectId ? { projectId } : {}),
    });
    await fetch(`/api/ai/ask?${params}`, { method: "DELETE" });
    setMessages([]);
  }, [workspaceSlug, mode, projectId]);

  const config = MODE_CONFIG[mode];
  const availableModes: ChatMode[] = isAdmin
    ? ["personal", "project", "workspace"]
    : ["personal", "project"];

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId]
  );

  return (
    <main className="min-h-screen text-slate-900 dark:text-slate-100">
      {/* Header with mode tabs */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 bg-gradient-to-br ${config.accent}`}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{config.description}</p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-red-300 hover:text-red-500 dark:border-slate-700 dark:text-slate-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear chat
            </button>
          )}
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2">
          {availableModes.map((m) => {
            const mc = MODE_CONFIG[m];
            const Icon = mc.icon;
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`
                  inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all
                  ${active
                    ? `bg-gradient-to-r ${mc.accent} text-white shadow-lg shadow-${m === "personal" ? "violet" : m === "project" ? "emerald" : "amber"}-500/20`
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300 dark:hover:bg-[#1a2332]"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {mc.label}
                {m === "personal" && <Lock className="h-3 w-3 opacity-60" />}
              </button>
            );
          })}

          {!isAdmin && (
            <div className="ml-2 flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Lock className="h-3 w-3" />
              Workspace mode: Admin only
            </div>
          )}
        </div>

        {/* Project selector (only in project mode) */}
        {mode === "project" && (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Project
            </label>
            <div className="w-64">
              <Select
                value={projectId}
                onChange={(v) => {
                  setProjectId(v);
                  setMessages([]);
                  historyLoadedFor.current = "";
                }}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                portal={false}
              />
            </div>
            {selectedProject && (
              <span className="text-xs text-slate-400">
                Chatting about <span className="font-semibold text-slate-600 dark:text-slate-200">{selectedProject.name}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 flex flex-col gap-4 min-h-[640px]">
          <AIChatInterface
            messages={[
              ...messages,
              ...(isThinking
                ? [{ id: "thinking", role: "ai", text: "", loading: true } as ChatMessage]
                : []),
            ]}
            onSend={sendMessage}
            emptyTitle={config.emptyTitle}
            emptyDescription={config.emptyDesc}
            mode={mode}
          />
          <SuggestedPrompts mode={mode} onSelect={sendMessage} />
        </section>

        {/* Sidebar — only in project/workspace modes */}
        {mode !== "personal" && (
          <aside className="lg:col-span-4 space-y-4">
            {(mode === "project" || mode === "workspace") && (
              <MeetingToTasksFlow workspaceId={workspaceId} projects={projects} />
            )}
            {(mode === "project" || mode === "workspace") && (
              <WeeklySummaryTrigger workspaceId={workspaceId} projects={projects} />
            )}
            <div className={`rounded-xl border ${config.border} ${config.accentBg} px-4 py-3 text-xs ${config.accentText} shadow-sm`}>
              <div className="flex items-center gap-2">
                <config.icon className="h-3.5 w-3.5" />
                <span className="font-semibold">{config.label} Mode</span>
                <span className="opacity-60">•</span>
                <span className="opacity-80">{workspaceSlug}</span>
              </div>
            </div>
          </aside>
        )}

        {/* Personal mode — full width chat, no sidebar */}
        {mode === "personal" && (
          <aside className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-[#0b1220]">
            <div className={`rounded-xl p-3 ${config.accentBg} mb-4`}>
              <Lock className={`h-6 w-6 ${config.accentText}`} />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Private Mode</h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
              This conversation is completely private. Only you can see your messages and AI responses.
            </p>
            <div className="mt-4 space-y-2 text-left text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Brainstorm ideas
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Draft messages & notes
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Ask questions & learn
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Plan & organize thoughts
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
