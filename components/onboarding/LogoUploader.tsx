"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Props = {
  onFileChange: (file: File | null) => void;
  helperText?: string;
};

export function LogoUploader({ onFileChange, helperText = "PNG, JPG, SVG up to 2MB" }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(file.type)) return;
    if (file.size > 2 * 1024 * 1024) return;
    const url = URL.createObjectURL(file);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onFileChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace Logo</label>
      <div
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 transition-all hover:border-primary/50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-primary/50"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          className="absolute inset-0 h-full w-full opacity-0"
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img src={preview} alt="Logo preview" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              onClick={(e) => {
                e.stopPropagation();
                setPreview((prev) => {
                  if (prev) URL.revokeObjectURL(prev);
                  return null;
                });
                onFileChange(null);
              }}
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary transition-transform group-hover:scale-110">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Drag & drop or <span className="text-primary">click to upload</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
