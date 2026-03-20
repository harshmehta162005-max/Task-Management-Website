type Props = {
  value: string;
  onChange: (v: string) => void;
};

import { Select } from "@/components/ui/Select";

const options = [
  { value: "updated_desc", label: "Recently updated" },
  { value: "due_asc", label: "Due soon" },
  { value: "due_desc", label: "Due latest" },
  { value: "priority_desc", label: "Priority high-low" },
];

export function SortControls({ value, onChange }: Props) {
  return (
    <Select value={value} onChange={onChange} options={options} size="sm" />
  );
}
