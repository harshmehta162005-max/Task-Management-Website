import { TaskStatus, AssigneeWorkStatus } from "@/generated/prisma/client";

export function deriveTaskStatus(
  currentTaskStatus: TaskStatus,
  assignees: { workStatus: AssigneeWorkStatus }[]
): TaskStatus {
  // If no assignees, we default to maintaining the current status (or TODO)
  if (!assignees || assignees.length === 0) {
    return currentTaskStatus === "IN_REVIEW" ? "IN_PROGRESS" : currentTaskStatus;
  }

  const total = assignees.length;
  const todoCount = assignees.filter(a => a.workStatus === "TODO").length;
  const submittedCount = assignees.filter(a => a.workStatus === "SUBMITTED").length;
  const inProgressCount = assignees.filter(a => a.workStatus === "IN_PROGRESS").length;

  // Rule C: When all assignees submitted -> READY_FOR_REVIEW (maps to IN_REVIEW)
  if (submittedCount === total) {
    return TaskStatus.IN_REVIEW;
  }

  // Rule B: When at least one assignee starts -> IN_PROGRESS
  if (inProgressCount > 0 || submittedCount > 0) {
    return TaskStatus.IN_PROGRESS;
  }

  // Rule A: On task creation (or when all are TODO) -> TODO
  if (todoCount === total) {
    return TaskStatus.TODO;
  }

  return TaskStatus.IN_PROGRESS; // Fallback
}
