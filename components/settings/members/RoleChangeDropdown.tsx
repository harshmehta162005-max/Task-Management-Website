"use client";

import { Role } from "./InviteMemberCard";
import { Select } from "@/components/ui/Select";

type Props = {
  role: Role;
  disabled?: boolean;
  onChange: (role: Role) => void;
};

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEMBER: "Member",
};

export function RoleChangeDropdown({ role, disabled, onChange }: Props) {
  return (
    <Select
      value={role}
      onChange={(v) => onChange(v as Role)}
      options={Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }))}
      className={disabled ? "opacity-60 pointer-events-none" : ""}
      size="sm"
      portal={false}
    />
  );
}
