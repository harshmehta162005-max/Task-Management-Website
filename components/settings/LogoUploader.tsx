"use client";

import { ImageIcon, UploadCloud } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
};

export function LogoUploader({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isHover, setHover] = useState(false);

  const pickFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result;
      if (typeof b64 === "string") {
        onChange(b64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={cn(
        "relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition",
        isHover ? "border-primary/60 bg-primary/5" : "border-slate-300 dark:border-slate-700"
      )}
      onClick={pickFile}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      {value ? (
        <img src={value} alt="Logo preview" className="h-full w-full rounded-2xl object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
          <UploadCloud className="h-5 w-5" />
          <span className="text-xs font-semibold">Upload</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {!value && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-slate-900/5 dark:from-white/5 dark:to-black/10" />
      )}
      {value && (
        <button
          type="button"
          className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-primary dark:border-slate-700 dark:bg-[#0f172a] dark:text-slate-200"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
        >
          <ImageIcon className="h-3 w-3" />
          Remove
        </button>
      )}
    </div>
  );
}
