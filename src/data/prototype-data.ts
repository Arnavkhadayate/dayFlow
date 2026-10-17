/** Local presentation-only data. Replace with API/server data in a later approved phase. */
export type PrototypeTask = { id: string; title: string; domain: string; estimate: string; due?: string; overdue?: boolean; tone: "blue" | "violet" | "orange" | "green" };
export const todaySchedule = [{ time: "10:00", title: "Algorithms lecture", detail: "Academic · Room 204" }, { time: "18:30", title: "Gym", detail: "Health · Upper body" }];
export const priorities: PrototypeTask[] = [
  { id: "p1", title: "Solve two graph problems", domain: "DSA & CP", estimate: "50 min", tone: "blue" },
  { id: "p2", title: "Ship the portfolio case study outline", domain: "Career", estimate: "45 min", tone: "violet" },
  { id: "p3", title: "Review database normalization notes", domain: "Academics", estimate: "30 min", tone: "orange" },
];
export const upcomingTasks: PrototypeTask[] = [
  { id: "u1", title: "Plan next week’s study blocks", domain: "Planning", estimate: "20 min", due: "Tomorrow", tone: "green" },
  { id: "u2", title: "Reply to internship coordinator", domain: "Career", estimate: "10 min", due: "Mon", tone: "violet" },
  { id: "u3", title: "Finish recursion practice set", domain: "DSA & CP", estimate: "1h", due: "Overdue", overdue: true, tone: "blue" },
];
export const inboxTasks: PrototypeTask[] = [
  { id: "i1", title: "Look into the hackathon brief", domain: "Uncategorized", estimate: "30 min", tone: "orange" }, { id: "i2", title: "Book a dentist appointment", domain: "Personal", estimate: "10 min", tone: "green" }, { id: "i3", title: "Watch system design lecture", domain: "Learning", estimate: "1h", tone: "violet" }, { id: "i4", title: "Message Rishi about Sunday", domain: "Friends", estimate: "5 min", tone: "green" }, { id: "i5", title: "Refactor authentication notes", domain: "Development", estimate: "35 min", tone: "blue" }, { id: "i6", title: "Find capstone project references", domain: "Academics", estimate: "25 min", tone: "orange" },
];
export const goals = [
  { title: "Build stronger graph intuition", domain: "DSA & CP", target: "Target · Dec 20", completed: 3, total: 5, progress: 60, tone: "blue", milestones: ["✓ Learn core traversal patterns", "✓ Complete 10 easy problems", "✓ Complete 8 medium problems", "Practice shortest paths", "Join next contest"] },
  { title: "A portfolio I’m proud to share", domain: "Career", target: "Target · Nov 30", completed: 2, total: 4, progress: 50, tone: "violet", milestones: ["✓ Select project stories", "✓ Gather screenshots", "Write case study", "Publish portfolio"] },
  { title: "Steady training routine", domain: "Health", target: "Ongoing", completed: 8, total: 12, progress: 67, tone: "green", milestones: ["✓ Train twice weekly", "✓ Track first month", "Plan next month"] },
];
