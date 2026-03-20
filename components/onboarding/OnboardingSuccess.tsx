import { CheckCircle2 } from "lucide-react";

type Props = { onFinish: () => void };

export function OnboardingSuccess({ onFinish }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center shadow-2xl">
      <div className="mb-4 flex justify-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-bold text-white">You&apos;re all set!</h3>
      <p className="mt-2 text-sm text-slate-400">Projects, people, and tasks are ready to roll.</p>
      <button
        type="button"
        onClick={onFinish}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
      >
        Go to dashboard
      </button>
    </div>
  );
}
