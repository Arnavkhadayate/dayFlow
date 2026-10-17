import { PrismaClient, TaskPriority, TaskStatus } from "@prisma/client";
const prisma = new PrismaClient();
const userId = process.env.DAYFLOW_DEMO_USER_ID ?? "00000000-0000-4000-8000-000000000001";
async function main() {
  const user = await prisma.user.upsert({ where: { email: "demo@dayflow.local" }, update: { name: "Arnav" }, create: { id: userId, email: "demo@dayflow.local", name: "Arnav", preferences: { create: {} } } });
  const domains = await Promise.all(["DSA & CP", "Academics", "Career", "Health", "Personal"].map((name, index) => prisma.domain.upsert({ where: { userId_name: { userId: user.id, name } }, update: {}, create: { userId: user.id, name, color: ["blue", "orange", "violet", "green", "green"][index] } })));
  const graphGoal = await prisma.goal.upsert({ where: { id: "00000000-0000-4000-8000-000000000101" }, update: {}, create: { id: "00000000-0000-4000-8000-000000000101", userId: user.id, domainId: domains[0].id, title: "Build stronger graph intuition", targetDate: new Date("2026-12-20") } });
  await prisma.milestone.createMany({ data: ["Learn core traversal patterns", "Complete 10 easy problems", "Practice shortest paths"].map((title, position) => ({ goalId: graphGoal.id, title, position })), skipDuplicates: true });
  await prisma.task.createMany({ data: [{ userId: user.id, domainId: domains[0].id, title: "Solve two graph problems", estimatedMinutes: 50, priority: TaskPriority.HIGH, status: TaskStatus.PLANNED, targetDate: new Date() }, { userId: user.id, domainId: domains[2].id, title: "Ship the portfolio case study outline", estimatedMinutes: 45, priority: TaskPriority.HIGH, status: TaskStatus.PLANNED, targetDate: new Date() }, { userId: user.id, title: "Look into the hackathon brief", estimatedMinutes: 30, status: TaskStatus.INBOX }] , skipDuplicates: true });
}
main().finally(() => prisma.$disconnect());
