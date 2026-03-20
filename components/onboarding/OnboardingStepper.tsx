import { Check } from "lucide-react";

type Step = {
  label: string;
};

type Props = {
  current: number;
  steps?: Step[];
};

const DEFAULT_STEPS: Step[] = [
  { label: "Create Project" },
  { label: "Invite Members" },
  { label: "Create First Task" },
];

export function OnboardingStepper({ current, steps = DEFAULT_STEPS }: Props) {
  return (
    <div className="relative space-y-0">
      {steps.map((step, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === current;
        const isComplete = stepNumber < current;

        return (
          <div key={step.label} className="relative flex items-start gap-4 pb-8 last:pb-0">
            {idx < steps.length - 1 && (
              <div className="absolute left-[15px] top-[32px] bottom-0 w-[2px] bg-primary/20" />
            )}
            <div
              className={
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 " +
                (isComplete
                  ? "border-primary bg-primary text-white shadow-[0_0_12px_rgba(79,70,229,0.45)]"
                  : isActive
                    ? "border-primary bg-primary text-white shadow-[0_0_12px_rgba(79,70,229,0.45)]"
                    : "border-white/10 bg-[#111827] text-slate-400")
              }
            >
              {isComplete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{stepNumber}</span>}
            </div>
            <div className="flex flex-col">
              <span
                className={
                  "text-sm font-semibold " + (isActive ? "text-primary" : isComplete ? "text-slate-200" : "text-slate-500")
                }
              >
                {step.label}
              </span>
              <span className="text-xs text-slate-500">{isActive ? "Current step" : isComplete ? "Completed" : "Pending"}</span>
            </div>
          </div>
        );
      })}
      <ul className="mt-6 space-y-3 text-sm text-slate-400">
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          Projects organize your work into focused areas
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          Invites bring your team together in one place
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          Tasks keep everyone aligned and moving forward
        </li>
      </ul>
    </div>
  );
}
