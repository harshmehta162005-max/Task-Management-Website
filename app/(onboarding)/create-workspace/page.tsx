"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { WorkspaceCreateCard } from "@/components/onboarding/WorkspaceCreateCard";
import { LogoUploader } from "@/components/onboarding/LogoUploader";
import { SlugInput } from "@/components/onboarding/SlugInput";
import { ToastContainer } from "@/components/auth/ToastContainer";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export default function CreateWorkspacePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // auto-suggest slug from name when user hasn't edited slug manually
  useEffect(() => {
    if (!slugEdited && name.trim()) {
      const next = slugify(name);
      setSlug(next);
    }
  }, [name, slugEdited]);

  const validations = useMemo(() => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Workspace name is required.");
    if (!slug.trim()) errs.push("Workspace slug is required.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || slug.length > 30) {
      errs.push("Slug must be 3-30 chars, lowercase letters/numbers and hyphens only.");
    }
    return errs;
  }, [name, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validations.length) {
      setError(validations[0]);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create workspace");
        setLoading(false);
        return;
      }

      setToast("Workspace created!");
      // Store the slug so onboarding can use it
      sessionStorage.setItem("onboarding_workspace_slug", slug.trim());
      setTimeout(() => router.push("/onboarding"), 500);
    } catch {
      setError("Failed to create workspace. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background-light px-4 py-8 text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
        <WorkspaceCreateCard error={error}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace Name</label>
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-600"
                placeholder="My Workspace"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-[12px] text-slate-400 dark:text-slate-500">You can change this later.</p>
            </div>

            <SlugInput
              value={slug}
              onChange={(val) => {
                setSlugEdited(true);
                setSlug(val);
              }}
              prefix="teamos.com/"
              error={
                slug && (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || slug.length > 30)
                  ? "Slug must be 3-30 chars, lowercase letters/numbers and hyphens only."
                  : undefined
              }
            />

            <LogoUploader onFileChange={(file) => setLogo(file)} />

            <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Create workspace
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => router.push("/onboarding")}
              >
                Skip for now
              </button>
            </div>
          </form>
        </WorkspaceCreateCard>

        <p className="text-center text-sm text-slate-500 dark:text-slate-600">
          Need help?{" "}
          <a className="font-medium text-primary hover:underline" href="#">
            Contact support
          </a>
        </p>
      </div>

      <ToastContainer message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
