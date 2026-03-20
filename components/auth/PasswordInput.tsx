"use client";

import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, Props>(function PasswordInput(
  { className, error, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            "block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-500",
            className
          )}
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : null}
    </div>
  );
});
