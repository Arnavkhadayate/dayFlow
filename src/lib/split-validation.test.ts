import assert from "node:assert/strict";
import test from "node:test";
import { draftTotalMinutes, splitDraftSchema } from "./split-validation";

const base = { requestKey: "c6d401e3-8ad7-4e52-9fcf-a0bb2f184e40", expectedUpdatedAt: "2026-10-17T09:00:00.000Z", children: [{ id: "a", title: "Read the notes", estimatedMinutes: 20, dependencyIds: [] }, { id: "b", title: "Solve one problem", estimatedMinutes: 30, dependencyIds: ["a"] }] };
test("calculates effort from the current draft", () => assert.equal(draftTotalMinutes(splitDraftSchema.parse(base)), 50));
test("rejects blank titles and non-positive duration", () => assert.throws(() => splitDraftSchema.parse({ ...base, children: [{ ...base.children[0], title: " " }, { ...base.children[1], estimatedMinutes: 0 }] })));
test("rejects duplicate identities", () => assert.throws(() => splitDraftSchema.parse({ ...base, children: [{ ...base.children[0] }, { ...base.children[1], id: "a" }] })));
test("rejects unresolved references and dependency cycles", () => { assert.throws(() => splitDraftSchema.parse({ ...base, children: [{ ...base.children[0], dependencyIds: ["missing"] }, base.children[1]] })); assert.throws(() => splitDraftSchema.parse({ ...base, children: [{ ...base.children[0], dependencyIds: ["b"] }, base.children[1]] })); });
