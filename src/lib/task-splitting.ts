import { Prisma, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { draftTotalMinutes, splitDraftSchema } from "@/lib/split-validation";

export class SplitConflictError extends Error {}

export async function splitTask(userId: string, parentTaskId: string, rawDraft: unknown) {
  const draft = splitDraftSchema.parse(rawDraft);
  const existingSplit = async () => prisma.taskSplit.findUnique({ where: { requestKey: draft.requestKey }, include: { parentTask: { include: { childTasks: true } } } });
  const repeated = await existingSplit();
  if (repeated) {
    if (repeated.parentTask.userId !== userId || repeated.parentTaskId !== parentTaskId) throw new SplitConflictError("This confirmation key was already used for another task.");
    return { parent: repeated.parentTask, children: repeated.parentTask.childTasks, idempotent: true };
  }
  try {
    return await prisma.$transaction(async (tx) => {
    const parent = await tx.task.findFirst({ where: { id: parentTaskId, userId }, include: { dependencies: true, dependents: true } });
    if (!parent) throw new Error("Task not found.");
    if (([TaskStatus.COMPLETED, TaskStatus.CANCELLED, TaskStatus.SUPERSEDED] as TaskStatus[]).includes(parent.status)) throw new Error("This task cannot be split.");
    if (parent.updatedAt.getTime() !== new Date(draft.expectedUpdatedAt).getTime()) throw new SplitConflictError("The task changed while this draft was open. Refresh and review it again.");
    const updated = await tx.task.updateMany({ where: { id: parent.id, userId, updatedAt: parent.updatedAt }, data: { status: TaskStatus.SUPERSEDED, plannedStart: null, plannedEnd: null } });
    if (updated.count !== 1) throw new SplitConflictError("The task changed while this draft was open.");
    const created = [] as { id: string; draftId: string }[];
    for (const child of draft.children) {
      const task = await tx.task.create({ data: { userId, parentTaskId: parent.id, title: child.title, estimatedMinutes: child.estimatedMinutes, priority: parent.priority, domainId: parent.domainId, goalId: parent.goalId, projectId: parent.projectId, hardDeadline: parent.hardDeadline, targetDate: parent.targetDate, status: TaskStatus.INBOX } });
      created.push({ id: task.id, draftId: child.id });
    }
    const byDraftId = new Map(created.map((child) => [child.draftId, child.id]));
    const inherited = parent.dependencies.map((dependency) => dependency.dependsOnTaskId);
    await tx.taskDependency.createMany({ data: draft.children.flatMap((child) => [...inherited, ...child.dependencyIds.map((id) => byDraftId.get(id)!)].map((dependsOnTaskId) => ({ taskId: byDraftId.get(child.id)!, dependsOnTaskId }))), skipDuplicates: true });
    await tx.taskDependency.deleteMany({ where: { taskId: { in: parent.dependents.map((dependency) => dependency.taskId) }, dependsOnTaskId: parent.id } });
    await tx.taskDependency.createMany({ data: parent.dependents.flatMap((dependency) => created.map((child) => ({ taskId: dependency.taskId, dependsOnTaskId: child.id }))), skipDuplicates: true });
    await tx.taskSplit.create({ data: { parentTaskId: parent.id, requestKey: draft.requestKey } });
    const children = await tx.task.findMany({ where: { id: { in: created.map((child) => child.id) } }, orderBy: { createdAt: "asc" } });
    return { parent: { ...parent, status: TaskStatus.SUPERSEDED }, children, totalMinutes: draftTotalMinutes(draft), idempotent: false };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      throw new SplitConflictError("Another change is in progress. Refresh and try again.");
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const concurrent = await existingSplit();
      if (concurrent?.parentTask.userId === userId && concurrent.parentTaskId === parentTaskId) return { parent: concurrent.parentTask, children: concurrent.parentTask.childTasks, idempotent: true };
      throw new SplitConflictError("This task was already split by another request.");
    }
    throw error;
  }
}
