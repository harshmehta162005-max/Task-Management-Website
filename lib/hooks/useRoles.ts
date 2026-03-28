import { useState, useEffect, useCallback, useRef } from "react";
import { RoleItem } from "@/components/settings/roles/rolesData";

/**
 * Global roles hook with support for:
 * - Automatic fetching on mount
 * - `mutate()` — refetch from server
 * - `mutate(updater, false)` — optimistic local update (no network)
 * - `mutate(updater)` — optimistic update + revalidate
 */
export function useRoles(workspaceSlug: string | undefined | null) {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const slugRef = useRef(workspaceSlug);
  slugRef.current = workspaceSlug;

  const fetchRoles = useCallback(async () => {
    const slug = slugRef.current;
    if (!slug) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/workspaces/${slug}/roles`);
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles, workspaceSlug]);

  /**
   * SWR-like mutate:
   * - `mutate()` — refetch from server
   * - `mutate(updaterFn, revalidate?)` — apply optimistic update locally
   *     If revalidate is false, skip network refetch.
   */
  const mutate = useCallback(
    async (
      updater?: ((current: RoleItem[] | undefined) => RoleItem[] | undefined) | undefined,
      revalidate: boolean = true
    ) => {
      if (updater) {
        // Optimistic: apply the updater to current state
        setRoles((prev) => updater(prev) ?? prev);
      }
      if (revalidate || !updater) {
        await fetchRoles();
      }
    },
    [fetchRoles]
  );

  return { roles, isLoading, error, mutate };
}
