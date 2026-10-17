import { NextResponse } from "next/server";
import { createTask, listTasks } from "@/lib/tasks";
import { getDemoUserId } from "@/lib/current-user";

export async function GET() {
  try { return NextResponse.json(await listTasks(await getDemoUserId())); }
  catch (error) { console.error("Task list failed", error); return NextResponse.json({ error: "Tasks could not be loaded. Please retry." }, { status: 500 }); }
}
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Task data must be valid JSON." }, { status: 400 }); }
  try { return NextResponse.json(await createTask(await getDemoUserId(), body), { status: 201 }); }
  catch (error) {
    if (error instanceof Error && error.name === "ZodError") return NextResponse.json({ error: "Enter a task title of up to 200 characters." }, { status: 400 });
    if (error instanceof Error && error.message.includes("Referenced records")) return NextResponse.json({ error: "A selected task relation is unavailable." }, { status: 400 });
    console.error("Task creation failed", error);
    return NextResponse.json({ error: "Task could not be saved. Please retry." }, { status: 500 });
  }
}
