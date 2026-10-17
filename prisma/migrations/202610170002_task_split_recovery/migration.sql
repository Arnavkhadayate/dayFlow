-- Missed tasks are a deterministic recovery state; no automatic scheduling is performed.
ALTER TYPE "TaskStatus" ADD VALUE IF NOT EXISTS 'MISSED';

-- One split record per parent prevents duplicate confirmations and retains an idempotency key.
CREATE TABLE "TaskSplit" (
  "id" TEXT NOT NULL,
  "parentTaskId" TEXT NOT NULL,
  "requestKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TaskSplit_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TaskSplit_parentTaskId_key" ON "TaskSplit"("parentTaskId");
CREATE UNIQUE INDEX "TaskSplit_requestKey_key" ON "TaskSplit"("requestKey");
ALTER TABLE "TaskSplit" ADD CONSTRAINT "TaskSplit_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
