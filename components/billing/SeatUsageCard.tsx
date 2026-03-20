"use client";

import Link from "next/link";

type Props = {
  seatsUsed: number;
  seatsTotal: number;
  activeMembers: number;
  invitedMembers: number;
  onAddSeats?: () => void;
  membersHref: string;
};

export function SeatUsageCard({ seatsUsed, seatsTotal, activeMembers, invitedMembers, onAddSeats, membersHref }: Props) {
  const percent = Math.min(100, Math.round((seatsUsed / seatsTotal) * 100));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">👥</div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Seats</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Seat usage</h2>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {seatsUsed} <span className="text-sm font-normal text-slate-500">/ {seatsTotal} seats</span>
          </p>
          <span className="text-sm text-slate-500 dark:text-slate-400">{percent}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {activeMembers} active members, {invitedMembers} invited.
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
        <button
          onClick={onAddSeats}
          className="text-primary font-semibold hover:text-primary/80"
          type="button"
        >
          + Add seats
        </button>
        <Link href={membersHref} className="text-slate-500 hover:text-primary dark:text-slate-300">
          Manage members
        </Link>
      </div>
    </section>
  );
}
