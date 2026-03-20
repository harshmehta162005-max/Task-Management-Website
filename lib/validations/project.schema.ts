import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be at most 100 characters")
    .trim(),
  description: z.string().max(500).optional().or(z.literal("")),
  visibility: z.enum(["PRIVATE", "WORKSPACE"]).default("WORKSPACE"),
  workspaceId: z.string().cuid(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  description: z.string().max(500).optional(),
  visibility: z.enum(["PRIVATE", "WORKSPACE"]).optional(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
