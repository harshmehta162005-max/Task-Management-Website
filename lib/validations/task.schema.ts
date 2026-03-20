import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be at most 200 characters")
    .trim(),
  description: z.string().max(5000).optional().or(z.literal("")),
  status: z
    .enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"])
    .default("TODO"),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  dueDate: z.string().datetime().optional().or(z.literal("")),
  projectId: z.string().cuid(),
  assigneeIds: z.array(z.string().cuid()).optional().default([]),
  tagIds: z.array(z.string().cuid()).optional().default([]),
  parentId: z.string().cuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"]).optional(),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  position: z.number().int().min(0).optional(),
});

export const moveTaskSchema = z.object({
  projectId: z.string().cuid(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
