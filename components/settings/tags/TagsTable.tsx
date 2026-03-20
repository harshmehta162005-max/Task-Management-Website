import { TagItem } from "./TagRow";
import { TagRow } from "./TagRow";
import { TagsEmptyState } from "./TagsEmptyState";

type Props = {
  tags: TagItem[];
  onEdit: (tag: TagItem) => void;
  onDelete: (tag: TagItem) => void;
  onCreate: () => void;
};

export function TagsTable({ tags, onEdit, onDelete, onCreate }: Props) {
  if (!tags.length) return <TagsEmptyState onCreate={onCreate} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f172a]">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-[#0d1422] dark:text-slate-400">
            <tr>
              <th className="px-6 py-3">Tag</th>
              <th className="px-6 py-3">Usage</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {tags.map((tag) => (
              <TagRow key={tag.id} tag={tag} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
