import { z } from "zod";

export const askAISchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt cannot be empty")
    .max(2000, "Prompt must be at most 2000 characters")
    .trim(),
  scope: z.enum(["workspace", "my_tasks", "project"]).default("workspace"),
  projectId: z.string().cuid().optional(),
});

export const meetingToTasksSchema = z.object({
  notes: z
    .string()
    .min(10, "Meeting notes must be at least 10 characters")
    .max(10000, "Meeting notes must be at most 10000 characters")
    .trim(),
  projectId: z.string().cuid(),
});

export type AskAIInput = z.infer<typeof askAISchema>;
export type MeetingToTasksInput = z.infer<typeof meetingToTasksSchema>;
