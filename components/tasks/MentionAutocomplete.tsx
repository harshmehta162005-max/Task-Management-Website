"use client";

type Props = {
  query: string;
  people: { id: string; name: string }[];
  onSelect: (person: { id: string; name: string }) => void;
};

export function MentionAutocomplete({ query, people, onSelect }: Props) {
  if (!query) return null;
  const filtered = people.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  if (!filtered.length) return null;
  return (
    <div className="absolute bottom-14 left-10 z-20 w-56 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-[#0f172a]">
      {filtered.map((p) => (
        <button
          key={p.id}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(p)}
          className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
