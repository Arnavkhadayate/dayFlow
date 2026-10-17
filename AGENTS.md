# Dayflow contributor guide

## Scope and incremental delivery

- Build only the approved implementation-plan phase. Do not add adjacent features speculatively.
- Inspect the relevant files and current working-tree status before editing. Preserve existing work and explain any necessary replacement.
- Keep changes small, focused, and independently testable. Avoid unrelated refactors.
- Do not deploy, push, reset history, delete data, or reset/drop a database unless the user explicitly requests it.

## Code conventions

- Use Next.js App Router, TypeScript in strict mode, Tailwind CSS, shadcn/ui, PostgreSQL, and Prisma unless an approved phase changes this decision.
- Prefer server components and server-side data access; make client components only when browser interactivity requires them.
- Keep domain rules in explicit, typed application services rather than UI components or database triggers.
- Make scheduling, deadline handling, dependency validation, and persistence deterministic. Store times with time zones and define a single comparison policy.
- Validate all external input at boundaries (forms, route handlers, server actions, jobs) with a shared schema library.

## Safety and security

- Never commit secrets, API keys, session tokens, database URLs, or production data. Provide `.env.example` with placeholder values only.
- Authenticate and authorize every user-scoped read or write on the server; never trust a client-supplied user ID.
- Use Prisma parameterization; do not compose SQL with untrusted strings.
- Validate AI suggestions before display and require explicit user confirmation plus server-side validation before they alter persistent state.
- Treat migrations as append-only, reviewable changes. Never resolve migration failures by deleting or resetting a database without explicit approval.

## Testing and verification

- Add or update unit tests for domain rules and recovery transitions, integration tests for persistence boundaries, and end-to-end coverage for critical user flows as those layers are introduced.
- Run the relevant formatter, type check, lint, and affected tests for each change. Report actual command results; do not claim checks that were not run.
- Use deterministic clocks and fixtures in tests. Cover edge cases such as overdue tasks, completed dependencies, timezone boundaries, and concurrent updates.
