# Dayflow MVP product specification

## Product intent

Dayflow is a personal planning system for a student balancing DSA and competitive programming, development learning, academics, independent projects, career preparation, gym, friendships, and everyday tasks. It should turn an overwhelming backlog into an honest, achievable daily plan and make recovery from missed commitments straightforward.

## Problems to solve

- Tasks are postponed because they are vague, oversized, or easy to ignore.
- Important work is forgotten when it is not surfaced at the right time.
- Daily plans overcommit available time and compete across life domains.
- Repeatedly postponed work loses context instead of being deliberately recovered.
- Users cannot easily see whether their week is balanced across responsibilities and well-being.

## MVP users and outcomes

The initial user is an individual student using one private account. Each day, they can capture work, set realistic commitments, complete or defer tasks intentionally, and recover missed work without losing its history.

The MVP succeeds when a user can:

1. Capture a task in a domain with an estimate, deadline, and optional dependencies.
2. Plan a daily set of tasks within a configured capacity budget.
3. Track habits and view them alongside planned work.
4. Complete, postpone, reschedule, or split work with a clear audit trail.
5. See overdue and repeatedly postponed items and resolve them deliberately.
6. Review simple domain balance signals for the current week.

## Core domain model

- **Domain:** a life area, seeded with DSA/competitive programming, development learning, academics, projects, career, gym, friendships, and personal admin. Users may add or rename domains later if approved.
- **Goal:** an optional outcome with a target date; tasks may contribute to it.
- **Task:** a concrete, actionable unit of work with title, notes, domain, estimate, optional deadline, planned date, priority, dependencies, lifecycle state, and immutable event history.
- **Habit:** a repeatable behavior with a cadence and completion records.
- **Daily capacity:** the usable planned-work minutes for a local calendar day. It is distinct from the full day length.
- **Plan:** the deterministic ordered selection of tasks committed for a day, whose estimates must not exceed capacity.

## Task lifecycle

`inbox → planned → in_progress → completed`

Tasks may move from `inbox`, `planned`, or `in_progress` to `cancelled`. A planned or in-progress task may move to `deferred` when it is intentionally moved to a future date. A task becomes `missed` when its planned date passes without completion; this is computed deterministically, not set by an unvalidated client action. A missed task cannot silently re-enter a plan: it must be rescheduled, deferred, cancelled, or split.

Every state change records the timestamp, actor, prior state, next state, and reason where applicable. Completed and cancelled tasks are terminal for the MVP; reopening is a later release decision.

## Missed-task recovery workflow

At daily review (and whenever a missed task is opened), Dayflow presents one of four explicit choices:

1. **Reschedule:** choose a future day; validate capacity and unresolved dependencies.
2. **Defer:** retain the task and record a reason plus a future review date.
3. **Split:** replace the oversized task with smaller actionable child tasks.
4. **Cancel:** record why it is no longer worth doing.

Splitting requires at least two child tasks, each with a positive estimate. The parent becomes `superseded`, preserves its history, and cannot be completed. Its dependencies are inherited by children unless the user explicitly assigns them; downstream tasks are blocked until every required replacement child is completed. Child estimates and dates must be validated before persistence. The recovery action never changes state based solely on AI output: any AI-suggested split is a draft that the user confirms and server-side rules validate.

## Planning rules

- Planning uses the user’s local date and configured timezone.
- The sum of planned task estimates may not exceed daily capacity; overflow is surfaced rather than silently accepted.
- A task with incomplete dependencies cannot be planned as actionable work.
- Deadlines inform ordering and warnings but do not invent available time or override capacity.
- Repeated deferrals are counted and visibly flagged; the MVP does not auto-cancel or auto-reschedule tasks.
- All ordering, capacity, deadline, dependency, and persistence decisions are deterministic and testable.

## MVP scope

- Private account authentication and user-scoped data isolation.
- Domain, goal, task, dependency, and habit CRUD.
- Today view, inbox, daily planning, completion, and missed-task recovery.
- Configurable daily capacity and timezone.
- Basic weekly domain-balance summary using planned and completed minutes.
- Event history for task lifecycle changes.

## Explicit non-goals for release one

- Social feeds, shared workspaces, collaboration, chat, and accountability partners.
- Calendar-provider sync, email ingestion, push notifications, and native mobile apps.
- Automated scheduling, autonomous task reprioritization, or AI actions that mutate data.
- Complex recurring projects, subtasks beyond recovery splitting, kanban boards, time tracking, or file attachments.
- Grades, workout programming, nutrition tracking, spending tracking, or specialized DSA problem integrations.
- Billing, teams, public profiles, marketplace integrations, and analytics beyond the personal weekly summary.
