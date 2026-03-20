type Props = {
  value: string;
  onChange: (color: string) => void;
};

const palette = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // amber
  "#22c55e", // green
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#6366f1", // indigo
  "#a855f7", // purple
  "#ec4899", // pink
  "#64748b", // slate
];

export function ColorPalettePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {palette.map((color) => {
        const active = value === color;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            style={{
              backgroundColor: color,
              boxShadow: active ? `0 0 0 4px rgba(79,70,229,0.35)` : undefined,
            }}
            aria-label={color}
          />
        );
      })}
    </div>
  );
}
