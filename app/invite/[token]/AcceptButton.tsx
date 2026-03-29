"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Props {
  token: string;
  isAuthenticated: boolean;
}

export function AcceptButton({ token, isAuthenticated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAccept = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to accept invite");
      }
      // Redirect to the workspace dashboard
      router.push(`/${data.workspaceSlug}/dashboard`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(`/invite/${token}`);
    return (
      <div className="flex w-full flex-col gap-3">
        <Link
          href={`/login?redirect_url=${returnUrl}`}
          className="flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
        >
          Sign In to Accept
        </Link>
        <Link
          href={`/signup?redirect_url=${returnUrl}`}
          className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800 transition-all"
        >
          Create an Account
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={handleAccept}
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-5 w-5 transition-transform group-hover:scale-110" />
        )}
        {loading ? "Accepting..." : "Accept Invitation"}
      </button>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
