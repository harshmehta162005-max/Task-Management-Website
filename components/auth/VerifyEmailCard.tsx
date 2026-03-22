import { ShieldCheck, RefreshCcw, Mail, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  email: string;
  onContinue: () => void;
  onResend: () => void;
  loadingResend?: boolean;
  children?: ReactNode;
};

export function VerifyEmailCard({ email, onContinue, onResend, loadingResend = false, children }: Props) {
  return (
    <div className="w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111827] sm:p-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <ShieldCheck className="h-7 w-7 text-primary" />
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TeamOS</span>
        </div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Verify your email</h1>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          We’ve sent a verification link to your inbox. Please follow the instructions to secure your account.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-[#0B0F17]/50">
          <Mail className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-primary">{email}</span>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Next Steps</h3>
          <ul className="space-y-3">
            {[
              "Open your inbox and find the email from TeamOS.",
              'Click the "Verify Email" button in the message.',
              "Return to this window to continue your setup.",
            ].map((text, idx) => (
              <li key={text} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {idx + 1}
                </span>
                <span className="leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-4 text-xs text-indigo-200">
          <RefreshCcw className="h-4 w-4 shrink-0 text-indigo-300" />
          <p>Don&apos;t see it? Check your spam folder or wait a few minutes before requesting another link.</p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={onContinue}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            I’ve verified — continue
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={onResend}
            disabled={loadingResend}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5",
              loadingResend && "opacity-60"
            )}
          >
            <RefreshCcw className={cn("h-4 w-4", loadingResend && "animate-spin")} />
            Resend email
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
