import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;
  onClick?: () => void;
  className?: string;
};

export function OAuthButton({ label, Icon, onClick, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
        className
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-900">
        <Icon className="h-4 w-4 text-[#4285F4]" />
      </span>
      <span>{label}</span>
    </button>
  );
}
