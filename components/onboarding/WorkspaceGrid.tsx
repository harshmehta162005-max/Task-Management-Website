import { WorkspaceCard, type Workspace } from "./WorkspaceCard";
import { WorkspaceCardSkeleton } from "./WorkspaceCardSkeleton";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

type Props = {
  workspaces: Workspace[];
  loading?: boolean;
  onSelect: (ws: Workspace) => void;
  onCreate: () => void;
};

export function WorkspaceGrid({ workspaces, loading, onSelect, onCreate }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <WorkspaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!workspaces.length) {
    return <WorkspaceEmptyState onCreate={onCreate} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {workspaces.map((ws) => (
        <WorkspaceCard key={ws.slug} workspace={ws} onSelect={onSelect} />
      ))}
    </div>
  );
}
