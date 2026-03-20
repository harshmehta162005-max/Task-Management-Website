type Props = {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ checked = false, onCheckedChange }: Props) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
    />
  );
}

export default Checkbox;
