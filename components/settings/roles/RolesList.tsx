"use client";

import { RoleItem } from "./rolesData";
import { RoleCard } from "./RoleCard";

type Props = {
  roles: RoleItem[];
  selectedId: string;
  isAdmin: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function RolesList({ roles, selectedId, isAdmin, onSelect, onEdit, onDuplicate, onDelete }: Props) {
  return (
    <div className="space-y-3">
      {roles.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          active={role.id === selectedId}
          isAdmin={isAdmin}
          onSelect={() => onSelect(role.id)}
          onEdit={() => onEdit(role.id)}
          onDuplicate={() => onDuplicate(role.id)}
          onDelete={() => onDelete(role.id)}
        />
      ))}
    </div>
  );
}
