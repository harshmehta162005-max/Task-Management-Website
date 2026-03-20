"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ProjectsHeader } from "@/components/projects/ProjectsHeader";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import type { Project } from "@/components/projects/types";

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"active" | "archived">("active");
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/projects?workspaceSlug=${workspaceSlug}`);
        if (!res.ok) throw new Error("Failed to load projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [workspaceSlug]);

  useEffect(() => {
    const modal = searchParams.get("create");
    setShowCreate(modal === "true");
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.status !== filter) return false;
      if (!query.trim()) return true;
      return p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    });
  }, [projects, query, filter]);

  const handleCreate = () => {
    setShowCreate(true);
    router.replace(`?create=true`);
  };

  const handleCloseModal = () => {
    setShowCreate(false);
    router.replace(`?`);
  };

  const handleSubmit = async (input: { name: string; description?: string; members: string[] }) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceSlug,
          name: input.name,
          description: input.description,
          members: input.members,
        }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const newProject = await res.json();
      setProjects((prev) => [newProject, ...prev]);
      handleCloseModal();
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
      <ProjectsHeader
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        onOpenCreate={handleCreate}
      />

      <ProjectsGrid
        projects={filteredProjects}
        isLoading={isLoading}
        isManager={true}
        onCreate={handleCreate}
        workspaceSlug={workspaceSlug}
      />

      <CreateProjectModal open={showCreate} onClose={handleCloseModal} onSubmit={handleSubmit} />
    </main>
  );
}
