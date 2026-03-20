"use client";

type Props = {
  title?: string;
  subtitle?: string;
};

export function ProfileHeader({
  title = "Profile",
  subtitle = "Manage your personal account settings.",
}: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 px-1">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>
    </header>
  );
}
