import { cn } from "@/lib/utils/cn";

type Props = {
  label: string;
  color: string;
};

export function TagChip({ label, color }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide border"
      )}
      style={{
        color,
        backgroundColor: `${color}1a`,
        borderColor: `${color}33`,
      }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}80`,
        }}
      />
      {label}
    </span>
  );
}
