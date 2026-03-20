"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  initialAvatar?: string;
  name: string;
};

export function AvatarCard({ initialAvatar, name }: Props) {
  const [avatar, setAvatar] = useState(initialAvatar);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const handleRemove = () => setAvatar(undefined);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-slate-100 dark:bg-slate-800">
            {avatar ? (
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-primary">{name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Avatar</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload a square image (400x400 recommended). It will show across the workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
            >
              Upload image
            </button>
            <button
              onClick={handleRemove}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Remove avatar
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
