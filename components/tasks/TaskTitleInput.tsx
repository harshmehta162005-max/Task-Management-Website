type Props = {
  title: string;
  onChange: (title: string) => void;
  readOnly?: boolean;
};

export function TaskTitleInput({ title, onChange, readOnly = false }: Props) {
  return (
    <input
      value={title}
      onChange={(e) => { if (!readOnly) onChange(e.target.value) }}
      disabled={readOnly}
      className="w-full rounded-xl border border-transparent bg-transparent text-xl font-semibold text-slate-900 outline-none transition focus:border-primary focus:bg-white/40 focus:shadow-sm dark:text-white dark:focus:bg-white/5 disabled:opacity-80"
    />
  );
}
