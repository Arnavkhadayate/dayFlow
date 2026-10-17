import { NextResponse } from "next/server";
import { SplitConflictError, splitTask } from "@/lib/task-splitting";
import { getDemoUserId } from "@/lib/current-user";

export async function POST(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try { const { taskId } = await params; const result = await splitTask(await getDemoUserId(), taskId, await request.json()); return NextResponse.json(result, { status: result.idempotent ? 200 : 201 }); }
  catch (error) {
    if (error instanceof SplitConflictError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof Error && (error.name === "ZodError" || error.message === "Task not found." || error.message === "This task cannot be split.")) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Task split failed", error);
    return NextResponse.json({ error: "Split could not be saved. Please retry." }, { status: 500 });
  }
}
