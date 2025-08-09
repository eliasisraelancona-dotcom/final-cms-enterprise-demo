# Architecture

## System
- Keystone app with lists (entities), access control, hooks, and Admin UI.
- Prisma ORM with SQLite for local demo (easily switchable to other providers).

## Access Control
- Role-based permissions across lists/fields.
- Department-level isolation and ownership checks.
- Reviewer/approver flows enforced at list and mutation levels.

## Workflows
- Content lifecycle: Draft → Review → Approved → Published.
- Actions gated by role and state; audit events recorded.

## Data & Storage
- SQLite file `./keystone.db` for local persistence.
- Static assets served from `public/` (`/files`, `/images`).

## Admin UI
- Next.js-powered Keystone Admin UI on http://localhost:3000.
- First run seeds super admin and baseline demo data.

## Extensibility
- Add/modify lists in `schema.ts` (not `schema.prisma` directly).
- Keystone generates Prisma/GraphQL schema from `schema.ts`.

