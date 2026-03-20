import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function PermissionToggleRow({ label, description, checked, disabled, onChange }: Props) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-white/5">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
          disabled && "cursor-not-allowed opacity-60"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow transition",
            checked ? "right-1" : "left-1"
          )}
        />
      </button>
    </div>
  );
}
