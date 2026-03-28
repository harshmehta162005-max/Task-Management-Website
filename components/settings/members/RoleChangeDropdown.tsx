"use client";

import { Select } from "@/components/ui/Select";
import { useRoles } from "@/lib/hooks/useRoles";

type Props = {
  role: string;
  workspaceSlug: string;
  disabled?: boolean;
  onChange: (role: string) => void;
};

export function RoleChangeDropdown({ role, workspaceSlug, disabled, onChange }: Props) {
  const { roles } = useRoles(workspaceSlug);
  
  return (
    <Select
      value={role}
      onChange={(v) => onChange(v)}
      options={roles.filter(r => r.name !== "Owner").map(r => ({ value: r.name, label: r.name }))}
      className={disabled ? "opacity-60 pointer-events-none" : ""}
      size="sm"
      portal={false}
    />
  );
}
