import { Select } from "@/components/ui/Select";

type Scope = "workspace" | "project" | "my-tasks";

type Props = {
  scope: Scope;
  projectId: string;
  projects: { id: string; name: string }[];
  onScopeChange: (s: Scope) => void;
  onProjectChange: (id: string) => void;
};

export function ScopeSelector({ scope, projectId, projects, onScopeChange, onProjectChange }: Props) {
  const scopeOptions = [
    { value: "workspace", label: "Entire Workspace" },
    { value: "project", label: "Specific Project" },
    { value: "my-tasks", label: "My Tasks Only" },
  ];

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Context scope
      </label>
      <Select value={scope} onChange={(v) => onScopeChange(v as Scope)} options={scopeOptions} portal={false}/>

      {scope === "project" ? (
        <Select value={projectId} onChange={onProjectChange} options={projectOptions} />
      ) : null}
    </div>
  );
}

export type ScopeValue = Scope;
