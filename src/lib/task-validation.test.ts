import assert from "node:assert/strict";
import test from "node:test";
import { taskInputSchema } from "./task-validation";

test("requires a non-blank task title", () => {
  assert.throws(() => taskInputSchema.parse({ title: "   " }));
});
test("rejects an invalid planned range", () => {
  assert.throws(() => taskInputSchema.parse({ title: "Read", plannedStart: "2026-10-17T10:00:00.000Z", plannedEnd: "2026-10-17T09:00:00.000Z" }));
});
test("allows a valid persisted task shape", () => {
  const parsed = taskInputSchema.parse({ title: "Read", estimatedMinutes: 30, plannedStart: "2026-10-17T09:00:00.000Z", plannedEnd: "2026-10-17T10:00:00.000Z" });
  assert.equal(parsed.status, "INBOX");
});
