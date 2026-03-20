import { Pencil, Trash } from "lucide-react";
import { TagChip } from "./TagChip";

export type TagItem = {
  id: string;
  name: string;
  color: string;
  usageCount: number;
};

type Props = {
  tag: TagItem;
  onEdit: (tag: TagItem) => void;
  onDelete: (tag: TagItem) => void;
};

export function TagRow({ tag, onEdit, onDelete }: Props) {
  return (
    <tr className="hover:bg-slate-50 transition-colors dark:hover:bg-white/5">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: tag.color, boxShadow: `0 0 8px ${tag.color}80` }}
          />
          <TagChip label={tag.name} color={tag.color} />
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{tag.usageCount} tasks</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(tag)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-primary dark:hover:bg-white/5"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(tag)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
