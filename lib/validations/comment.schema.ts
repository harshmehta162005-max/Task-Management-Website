import { z } from "zod";

export const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be at most 2000 characters")
    .trim(),
  taskId: z.string().cuid(),
});

export const updateCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be at most 2000 characters")
    .trim(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
