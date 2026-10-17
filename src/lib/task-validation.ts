import { z } from "zod";

const optionalDate = z.string().datetime().optional().nullable();
export const taskInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(10_000).optional().nullable(),
  domainId: z.string().uuid().optional().nullable(), goalId: z.string().uuid().optional().nullable(), projectId: z.string().uuid().optional().nullable(), parentTaskId: z.string().uuid().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  estimatedMinutes: z.number().int().positive().max(1440).optional().nullable(), actualMinutes: z.number().int().nonnegative().max(10080).optional().nullable(),
  hardDeadline: optionalDate, targetDate: optionalDate, plannedStart: optionalDate, plannedEnd: optionalDate,
  status: z.enum(["INBOX", "PLANNED", "IN_PROGRESS", "COMPLETED", "DEFERRED", "CANCELLED", "SUPERSEDED", "MISSED"]).default("INBOX"),
}).superRefine((task, ctx) => {
  if (task.plannedStart && task.plannedEnd && new Date(task.plannedEnd) <= new Date(task.plannedStart)) ctx.addIssue({ code: "custom", path: ["plannedEnd"], message: "Planned end must be after planned start." });
});
export type TaskInput = z.infer<typeof taskInputSchema>;
