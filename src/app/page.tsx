"use client";

import { CalendarDays, ChevronDown, Circle, Clock3, FolderKanban, Inbox, ListPlus, Menu, MoreHorizontal, Plus, Search, Sparkles, Sun, Target, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { goals, todaySchedule, type PrototypeTask } from "@/data/prototype-data";

type Screen = "Today" | "Inbox" | "Calendar" | "Goals" | "Projects" | "Review";
const navigation = [{ label: "Today", icon: Sun }, { label: "Inbox", icon: Inbox, count: 6 }, { label: "Calendar", icon: CalendarDays }, { label: "Goals", icon: Target }, { label: "Projects", icon: FolderKanban }, { label: "Review", icon: Sparkles }] as const;
type PersistedTask = { id: string; title: string; estimatedMinutes: number | null; targetDate: string | null; hardDeadline: string | null; status: "INBOX" | "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED" | "CANCELLED" | "SUPERSEDED" | "MISSED"; domain: { name: string; color: string } | null };
const tone = (color: string | undefined): PrototypeTask["tone"] => color === "violet" || color === "orange" || color === "green" ? color : "blue";
const toPrototypeTask = (task: PersistedTask): PrototypeTask => ({ id: task.id, title: task.title, domain: task.domain?.name ?? "Uncategorized", estimate: task.estimatedMinutes ? `${task.estimatedMinutes} min` : "No estimate", due: task.status === "MISSED" ? "Overdue" : undefined, overdue: task.status === "MISSED", tone: tone(task.domain?.color) });

function TaskRow({ task, onOpen }: { task: PrototypeTask; onOpen: (task: PrototypeTask) => void }) { return <button className="task-row group w-full text-left" onClick={() => onOpen(task)} type="button"><span className="check" aria-hidden="true"><Circle size={17} /></span><span className="min-w-0 flex-1"><span className="block truncate font-medium text-stone-800">{task.title}</span><span className="mt-1 flex items-center gap-2 text-xs text-stone-500"><span className={`dot ${task.tone}`} /> {task.domain}<span className="text-stone-300">•</span> {task.estimate}</span></span>{task.due && <span className={task.overdue ? "overdue" : "task-date"}>{task.due}</span>}<MoreHorizontal className="hidden text-stone-400 group-hover:block" size={18} aria-hidden="true" /></button>; }

function Sidebar({ active, onNavigate, mobile = false }: { active: Screen; onNavigate: (screen: Screen) => void; mobile?: boolean }) { return <nav aria-label={mobile ? "Mobile navigation" : "Main navigation"} className={mobile ? "mobile-nav" : "sidebar"}>{!mobile && <div className="brand"><span>dayflow</span><ChevronDown size={15} /></div>}<div className="nav-list">{navigation.map((item) => { const Icon = item.icon; return <button key={item.label} type="button" onClick={() => onNavigate(item.label)} className={`nav-item ${active === item.label ? "active" : ""}`} aria-current={active === item.label ? "page" : undefined}><Icon size={mobile ? 20 : 18} strokeWidth={1.8} />{!mobile && <span>{item.label}</span>}{!mobile && "count" in item && <span className="nav-count">{item.count}</span>}</button>; })}</div>{!mobile && <div className="sidebar-bottom"><button className="avatar" type="button" aria-label="Open profile">AK</button><span>Arnav</span><MoreHorizontal size={17} /></div>}</nav>; }

function RecoveryDialog({ task, onClose }: { task: PrototypeTask; onClose: () => void }) { const [split, setSplit] = useState(false); return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="recovery-title" onMouseDown={(event) => event.stopPropagation()}><div className="dialog-top"><div><span className="eyebrow">TASK RECOVERY</span><h2 id="recovery-title">{task.title}</h2></div><button className="icon-button" onClick={onClose} type="button" aria-label="Close dialog"><X size={19} /></button></div><p className="dialog-copy">This task was planned for yesterday and is still unfinished. Choose a deliberate next step.</p><div className="recovery-options"><button type="button"><CalendarDays size={18} /><span><strong>Reschedule</strong><small>Move it to a day that has room.</small></span></button><button type="button"><Clock3 size={18} /><span><strong>Defer</strong><small>Keep it, and set a review date.</small></span></button><button type="button" className={split ? "selected" : ""} onClick={() => setSplit(true)}><ListPlus size={18} /><span><strong>Split into smaller tasks</strong><small>Make this easier to start and finish.</small></span></button></div>{split && <div className="split-form"><p>Create at least two actionable tasks. A connected task screen will validate and save only after confirmation.</p><label>First step<input defaultValue="Outline core concepts" /></label><label>Second step<input defaultValue="Solve two practice problems" /></label><button className="primary-button" type="button">Review split</button></div>}<button type="button" className="cancel-task">Cancel task</button></section></div>; }

function Today({ onOpen, tasks }: { onOpen: (task: PrototypeTask) => void; tasks: PersistedTask[] }) { const priorityTasks = tasks.filter((task) => task.status === "PLANNED" || task.status === "IN_PROGRESS").slice(0, 3).map(toPrototypeTask); const upcomingTasks = tasks.filter((task) => task.status !== "INBOX" && task.status !== "PLANNED" && task.status !== "IN_PROGRESS").slice(0, 3).map(toPrototypeTask); return <><header className="page-heading"><div><p className="eyebrow">FRIDAY, OCTOBER 17</p><h1>Today</h1><p className="subhead">A calm plan for the work that matters.</p></div><button className="outline-button" type="button"><CalendarDays size={16} /> Plan day</button></header><section className="capacity" aria-label="Available time"><div><span className="eyebrow">AVAILABLE TIME</span><strong>3h 15m</strong><p>of 5h planned capacity</p></div><div className="capacity-track"><span style={{ width: "35%" }} /></div><span className="capacity-detail">1h 45m planned</span></section><section className="content-section"><div className="section-title"><h2>Fixed commitments</h2><span>2 today</span></div><div className="commitments">{todaySchedule.map((item) => <div className="commitment" key={item.time}><time>{item.time}</time><span className="commitment-line" /><div><strong>{item.title}</strong><p>{item.detail}</p></div></div>)}</div></section><section className="content-section"><div className="section-title"><h2>Three priorities</h2><span>Keep the day focused</span></div><div className="priority-list">{priorityTasks.map((task, index) => <div className="priority" key={task.id}><span className="priority-number">0{index + 1}</span><TaskRow task={task} onOpen={onOpen} /></div>)}</div></section><section className="content-section"><div className="section-title"><h2>Up next</h2><button className="quiet-button" type="button">View all</button></div><div className="task-list">{upcomingTasks.map((task) => <TaskRow task={task} onOpen={onOpen} key={task.id} />)}</div></section></>; }
function InboxScreen({ onOpen, tasks }: { onOpen: (task: PrototypeTask) => void; tasks: PersistedTask[] }) { const inboxTasks = tasks.filter((task) => task.status === "INBOX").map(toPrototypeTask); return <><header className="page-heading"><div><p className="eyebrow">CAPTURED, NOT YET PLANNED</p><h1>Inbox</h1><p className="subhead">Give each item a home when you are ready.</p></div><span className="item-count">{inboxTasks.length} items</span></header><section className="inbox-intro"><Inbox size={19} /><p>These tasks are waiting for a domain, date, or a decision.</p></section><div className="task-list">{inboxTasks.map((task) => <TaskRow task={task} onOpen={onOpen} key={task.id} />)}</div></>; }
function GoalsScreen() { return <><header className="page-heading"><div><p className="eyebrow">A FEW MEANINGFUL DIRECTIONS</p><h1>Goals</h1><p className="subhead">Progress comes from small, visible steps.</p></div><button className="outline-button" type="button"><Plus size={16} /> New goal</button></header><div className="goal-list">{goals.map((goal) => <article className="goal" key={goal.title}><div className="goal-head"><div><span className={`dot ${goal.tone}`} /> <span className="goal-domain">{goal.domain}</span><h2>{goal.title}</h2></div><span className="goal-date">{goal.target}</span></div><div className="progress-label"><span>{goal.completed} of {goal.total} milestones</span><strong>{goal.progress}%</strong></div><div className="progress"><span style={{ width: `${goal.progress}%` }} /></div><ul>{goal.milestones.map((milestone) => <li key={milestone}><span className="milestone-check">{milestone.startsWith("✓") ? "✓" : ""}</span>{milestone.replace("✓ ", "")}</li>)}</ul></article>)}</div></>; }
function Placeholder({ screen }: { screen: Screen }) { return <div className="empty-state"><div className="empty-icon"><FolderKanban size={23} /></div><h1>{screen}</h1><p>This area is mapped for the prototype. Its working experience belongs to a later approved phase.</p></div>; }
export default function Home() {
  const [screen, setScreen] = useState<Screen>("Today");
  const [task, setTask] = useState<PrototypeTask | null>(null);
  const [tasks, setTasks] = useState<PersistedTask[]>([]);
  const [quickAdd, setQuickAdd] = useState("");
  const [quickAddError, setQuickAddError] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");
        const body: unknown = await response.json();
        if (!response.ok || !Array.isArray(body)) throw new Error("Tasks could not be loaded. Please refresh the page.");
        if (active) setTasks(body as PersistedTask[]);
      } catch (error) {
        if (active) setQuickAddError(error instanceof Error ? error.message : "Tasks could not be loaded. Please refresh the page.");
      }
    }

    void loadTasks();
    return () => { active = false; };
  }, []);

  async function submitQuickAdd(event: FormEvent) {
    event.preventDefault();
    const title = quickAdd.trim();
    if (!title) {
      setQuickAddError("Enter a task title.");
      return;
    }

    setIsCreatingTask(true);
    setQuickAddError(null);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const body: unknown = await response.json();
      if (!response.ok || !body || typeof body !== "object" || !("id" in body)) {
        const error = body && typeof body === "object" && "error" in body && typeof body.error === "string" ? body.error : "Task could not be saved. Please retry.";
        throw new Error(error);
      }
      setTasks((current) => [body as PersistedTask, ...current]);
      setQuickAdd("");
    } catch (error) {
      setQuickAddError(error instanceof Error ? error.message : "Task could not be saved. Please retry.");
    } finally {
      setIsCreatingTask(false);
    }
  }

  const content = screen === "Today" ? <Today onOpen={setTask} tasks={tasks} /> : screen === "Inbox" ? <InboxScreen onOpen={setTask} tasks={tasks} /> : screen === "Goals" ? <GoalsScreen /> : <Placeholder screen={screen} />;
  return <main className="app-shell"><Sidebar active={screen} onNavigate={setScreen} /><div className="workspace"><div className="mobile-top"><button className="icon-button" type="button" onClick={() => setShowMobileMenu(true)} aria-label="Open navigation"><Menu size={21} /></button><span className="mobile-brand">dayflow</span><button className="icon-button" type="button" aria-label="Search"><Search size={20} /></button></div><form className="quick-add" onSubmit={submitQuickAdd}><Plus size={19} /><input value={quickAdd} onChange={(event) => setQuickAdd(event.target.value)} placeholder="Add a task for later…" aria-label="Quick add task" disabled={isCreatingTask} /><kbd>⌘ ↵</kbd></form>{quickAddError && <p className="mx-6 mt-2 text-sm text-red-700" role="alert">{quickAddError}</p>}<div className="screen-content">{content}</div></div><Sidebar mobile active={screen} onNavigate={setScreen} />{showMobileMenu && <div className="mobile-menu"><div className="mobile-menu-head"><span className="brand">dayflow</span><button className="icon-button" onClick={() => setShowMobileMenu(false)} aria-label="Close navigation"><X size={20} /></button></div><Sidebar active={screen} onNavigate={(next) => { setScreen(next); setShowMobileMenu(false); }} /></div>}{task && <RecoveryDialog task={task} onClose={() => setTask(null)} />}</main>;
}
