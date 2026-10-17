# Dayflow implementation plan

Each phase is intentionally narrow and should be reviewed, tested, and approved before the next begins.

## Phase 0 — Repository foundation

Initialize the Next.js App Router project with TypeScript strict mode, Tailwind, shadcn/ui, linting, formatting, test runner, environment example, and CI checks. Add no product screens beyond a minimal health page.

**Acceptance checks:** clean install; type check; lint; unit-test command; production build.

## Phase 1 — Data model and authentication

Configure PostgreSQL and Prisma. Implement private-account authentication and user-scoped models for domains, goals, tasks, dependencies, task events, habits, and habit completions. Add migrations and seed only non-sensitive default domain names.

**Acceptance checks:** migration applies to an empty development database; unauthorized cross-user reads/writes fail; schema and migration tests pass.

## Phase 2 — Deterministic task lifecycle

Build typed domain services and validated server boundaries for task creation, editing, dependencies, lifecycle transitions, and event history. Define timezone-aware missed-task detection without background automation.

**Acceptance checks:** unit tests cover allowed and rejected transitions, cycle detection, incomplete dependencies, timezone boundaries, and immutable event records.

## Phase 3 — Inbox and task management

Implement accessible task capture, inbox, task detail, filtering, and domain/goal assignment. Support estimates, deadlines, priorities, and dependency selection.

**Acceptance checks:** end-to-end creation and edit flow; validation errors are shown; user data remains isolated.

## Phase 4 — Capacity-aware daily plan

Implement timezone and daily-capacity settings plus the Today view. Allow users to select and order actionable tasks for a day; reject plans exceeding capacity or violating dependencies. Surface deadlines and carryover candidates deterministically.

**Acceptance checks:** service and UI tests prove capacity limits, ordering persistence, deadline warnings, and dependency blocking.

## Phase 5 — Completion and missed-task recovery

Implement completion, defer/reschedule/cancel flows, and the missed-task recovery interface. Implement server-validated splitting: create two or more positive-estimate child tasks, preserve the parent as `superseded`, inherit or explicitly assign dependencies, and retain history.

**Acceptance checks:** end-to-end tests for each recovery choice; tests for split validation, parent immutability, dependency behavior, and audit history.

## Phase 6 — Habits and weekly balance

Implement habit definition and completion tracking. Add a simple weekly summary of planned and completed minutes by domain, alongside habit consistency.

**Acceptance checks:** deterministic aggregation tests and end-to-end habit completion flow.

## Phase 7 — Hardening and release readiness

Conduct accessibility, responsive-layout, security, error-state, and performance review. Add logging/monitoring configuration appropriate for Vercel and produce deployment documentation. Deployment itself requires explicit approval.

**Acceptance checks:** full test suite, production build, manual keyboard/screen-reader smoke test, security review checklist, and documented rollback approach.

## AI feature policy for any later phase

AI may propose summaries, priorities, schedules, or task splits only as drafts. The client displays the proposal; the user explicitly accepts selected changes; server-side schemas and deterministic domain services validate every proposed mutation before it is persisted. No model output receives direct database access.
