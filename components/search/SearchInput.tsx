"use client";

import { Search } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = forwardRef<HTMLInputElement, Props>(function SearchInput({ className, ...props }, ref) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-10 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-100",
          className
        )}
        {...props}
      />
    </div>
  );
});
