import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Workspace name must be at most 50 characters")
    .trim(),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be at most 30 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .trim(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();

export const inviteMemberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).default("MEMBER"),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
