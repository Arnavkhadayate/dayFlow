import { z } from "zod";

const childSchema = z.object({ id: z.string().min(1).max(80), title: z.string().trim().min(1).max(200), estimatedMinutes: z.number().int().positive().max(1440), dependencyIds: z.array(z.string().min(1)).default([]) });
export const splitDraftSchema = z.object({ requestKey: z.string().uuid(), expectedUpdatedAt: z.string().datetime(), children: z.array(childSchema).min(2).max(50) }).superRefine((draft, ctx) => {
  const ids = new Set<string>();
  for (const child of draft.children) { if (ids.has(child.id)) ctx.addIssue({ code: "custom", message: "Each subtask needs a unique identity." }); ids.add(child.id); }
  const graph = new Map(draft.children.map((child) => [child.id, child.dependencyIds]));
  for (const child of draft.children) for (const dependency of child.dependencyIds) { if (!graph.has(dependency)) ctx.addIssue({ code: "custom", message: "Dependencies must refer to draft subtasks." }); if (dependency === child.id) ctx.addIssue({ code: "custom", message: "A subtask cannot depend on itself." }); }
  const visiting = new Set<string>(), visited = new Set<string>(); const visit = (id: string) => { if (visiting.has(id)) { ctx.addIssue({ code: "custom", message: "Subtask dependencies cannot contain a cycle." }); return; } if (visited.has(id)) return; visiting.add(id); for (const next of graph.get(id) ?? []) visit(next); visiting.delete(id); visited.add(id); }; for (const id of graph.keys()) visit(id);
});
export type SplitDraft = z.infer<typeof splitDraftSchema>;
export const draftTotalMinutes = (draft: Pick<SplitDraft, "children">) => draft.children.reduce((total, child) => total + child.estimatedMinutes, 0);
