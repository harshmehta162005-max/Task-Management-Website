"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { createPortal } from "react-dom";

type Props = {
  date?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: any;
  placeholder?: string;
  className?: string;
};

export function DatePicker({
  date,
  onChange,
  disabled,
  placeholder = "Pick a date",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const CALENDAR_WIDTH = 260;
  const CALENDAR_HEIGHT = 270;
  const OFFSET = 6;

  useEffect(() => {
    setPortalRoot(document.getElementById("portal-root") || document.body);
  }, []);

  const calculatePosition = () => {
    const rect = dropdownRef.current?.getBoundingClientRect();
    if (!rect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + OFFSET;
    let left = rect.left;

    if (rect.bottom + CALENDAR_HEIGHT > viewportHeight) {
      top = rect.top - CALENDAR_HEIGHT - OFFSET;
    }

    if (rect.left + CALENDAR_WIDTH > viewportWidth) {
      left = viewportWidth - CALENDAR_WIDTH - 10;
    }

    if (left < 10) left = 10;

    setPosition({ top, left });
  };

  useEffect(() => {
    if (open) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isDropdownClick = dropdownRef.current?.contains(event.target as Node);
      const portals = document.querySelectorAll("#portal-root");
      let isPortalClick = false;
      portals.forEach(p => {
        if (p.contains(event.target as Node)) isPortalClick = true;
      });
      
      if (!isDropdownClick && !isPortalClick) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition
        hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
        dark:border-slate-700 dark:bg-[#111827] dark:hover:border-slate-600
        ${
          !date
            ? "text-slate-500"
            : "text-slate-900 dark:text-slate-100"
        } ${open ? "border-primary ring-2 ring-primary/20" : ""}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <CalendarIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="truncate text-left">
            {date ? format(date, "MMM d, yyyy") : placeholder}
          </span>
        </div>

        {date && (
          <div
            role="button"
            tabIndex={0}
            className="rounded-md p-1 hover:bg-slate-200 dark:hover:bg-slate-800 shrink-0 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(undefined);
            }}
          >
            <X className="h-3.5 w-3.5" />
          </div>
        )}
      </button>

      {open &&
        portalRoot &&
        createPortal(
          <div
            className="fixed z-[9999] w-[260px] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl
            dark:border-slate-700 dark:bg-[#0f172a] overflow-hidden
            animate-in fade-in zoom-in-95 duration-150"
            style={{
              top: position.top,
              left: position.left,
              height: CALENDAR_HEIGHT,
            }}
          >
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(selectedDate: Date | undefined) => {
                onChange?.(selectedDate);
                setOpen(false);
              }}
              disabled={disabled}
              showOutsideDays
              fixedWeeks
              className="rdp-custom"
              classNames={{
                months: "space-y-4",
                month: "space-y-3",
                month_caption:
                  "flex justify-between items-center font-bold text-slate-800 dark:text-white px-1",
                caption_label: "text-sm font-semibold",
                nav: "flex items-center space-x-1",
                button_previous: "h-7 w-7 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500",
                button_next: "h-7 w-7 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500",
                month_grid: "w-full mt-2 border-collapse",
                weekdays: "",
                weekday:
                  "text-slate-400 text-[10px] font-semibold text-center pb-2 w-8",
                week: "mt-1",
                day: "w-8 text-center p-0",
                day_button:
                  "h-7 w-7 mx-auto rounded-md flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium !p-0",
                selected:
                  "!bg-primary !text-white font-bold shadow-md",
                today: "text-primary font-bold bg-primary/10",
                outside:
                  "text-slate-400 opacity-50",
                disabled:
                  "text-slate-300 opacity-30 cursor-not-allowed",
                hidden: "hidden",
              }}
            />
          </div>,
          portalRoot
        )}
    </div>
  );
}