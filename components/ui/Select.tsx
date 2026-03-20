"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createPortal } from "react-dom";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
  portal?: boolean;
  disabled?: boolean;
};

export function Select({ value, onChange, options, placeholder, className, size = "md", portal = true, disabled = false }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !ref.current || !portal) return;
    const rect = ref.current.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 99999, // Guarantees it stays above the modal
    });
  }, [open, portal]);

  const selected = options.find((o) => o.value === value);
  const padding = size === "sm" ? "px-3 py-2 text-sm" : "px-3.5 py-2.5 text-sm";

  const menu = (
    <div
      className={cn(
        // h-fit guarantees it ONLY wraps the content. shadow-xl removes the giant dark blur.
        "h-fit w-full overflow-hidden rounded-xl border border-slate-700 bg-[#0f172a] text-slate-100 shadow-xl",
        portal ? "fixed" : "absolute left-0 right-0 top-full mt-2 z-[99999]"
      )}
      style={portal ? menuStyle : undefined}
    >
      <ul className="py-2 m-0 flex flex-col">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 transition-all duration-150 hover:bg-slate-700/50",
                  active && "bg-primary/20 text-white"
                )}
              >
                {active ? (
                  <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)] shrink-0" />
                ) : (
                  <span className="h-2 w-2 shrink-0" />
                )}

                <span className="font-medium">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-[#0f172a] text-slate-100 shadow-sm transition-all duration-200 hover:border-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed",
          padding
        )}
      >
        <span className={cn(!selected && "text-slate-400")}>{selected?.label ?? placeholder ?? "Select"}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (portal && mounted ? createPortal(menu, document.body) : menu)}
    </div>
  );
}