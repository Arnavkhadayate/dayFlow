import { Prisma, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { taskInputSchema, type TaskInput } from "@/lib/task-validation";

const relationChecks = async (userId: string, input: TaskInput, taskId?: string) => {
  const [domain, goal, project, parent] = await Promise.all([
    input.domainId ? prisma.domain.findFirst({ where: { id: input.domainId, userId } }) : true,
    input.goalId ? prisma.goal.findFirst({ where: { id: input.goalId, userId } }) : true,
    input.projectId ? prisma.project.findFirst({ where: { id: input.projectId, userId } }) : true,
    input.parentTaskId ? prisma.task.findFirst({ where: { id: input.parentTaskId, userId } }) : true,
  ]);
  if (!domain || !goal || !project || !parent) throw new Error("Referenced records must belong to the current user.");
  if (taskId && input.parentTaskId === taskId) throw new Error("A task cannot be its own parent.");
};
const toData = (input: TaskInput): Prisma.TaskUncheckedCreateInput => ({ ...input, description: input.description ?? null, domainId: input.domainId ?? null, goalId: input.goalId ?? null, projectId: input.projectId ?? null, parentTaskId: input.parentTaskId ?? null, estimatedMinutes: input.estimatedMinutes ?? null, actualMinutes: input.actualMinutes ?? null, hardDeadline: input.hardDeadline ? new Date(input.hardDeadline) : null, targetDate: input.targetDate ? new Date(input.targetDate) : null, plannedStart: input.plannedStart ? new Date(input.plannedStart) : null, plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null, completedAt: input.status === "COMPLETED" ? new Date() : null, userId: "" });

export async function createTask(userId: string, rawInput: unknown) { const input = taskInputSchema.parse(rawInput); await relationChecks(userId, input); const data = toData(input); return prisma.task.create({ data: { ...data, userId } }); }
export async function listTasks(userId: string) {
  return prisma.task.findMany({
    where: { userId, status: { not: TaskStatus.SUPERSEDED } },
    include: { domain: { select: { name: true, color: true } } },
    orderBy: [{ targetDate: "asc" }, { createdAt: "desc" }],
  });
}
export async function updateTask(userId: string, taskId: string, rawInput: unknown) { const input = taskInputSchema.parse(rawInput); const existing = await prisma.task.findFirst({ where: { id: taskId, userId } }); if (!existing) throw new Error("Task not found."); await relationChecks(userId, input, taskId); const data = toData(input); return prisma.task.update({ where: { id: taskId }, data: { ...data, userId: undefined } }); }
export async function completeTask(userId: string, taskId: string, actualMinutes?: number) { const task = await prisma.task.findFirst({ where: { id: taskId, userId } }); if (!task) throw new Error("Task not found."); if (actualMinutes !== undefined && (!Number.isInteger(actualMinutes) || actualMinutes < 0)) throw new Error("Actual duration must be a non-negative integer."); return prisma.task.update({ where: { id: taskId }, data: { status: TaskStatus.COMPLETED, completedAt: new Date(), actualMinutes } }); }
export async function deleteTask(userId: string, taskId: string) { const result = await prisma.task.deleteMany({ where: { id: taskId, userId } }); if (!result.count) throw new Error("Task not found."); }
