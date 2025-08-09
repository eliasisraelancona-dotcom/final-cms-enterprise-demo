# As of Friday August 8th at 7:15 PM EST we are going to use this demo moving forward

## Adobe Enterprise CMS (Demo)

This repository contains a demonstration Digital Asset Management (DAM) and CMS showcasing enterprise-grade patterns including role-based access control, workflow, and compliance. It is intended for reliable reuse without Prisma/GraphQL/schema issues when reopened.

### What this demo includes
- Role-Based Access Control with 7+ roles and granular permissions
- Digital Asset Management: upload, review, approve, archive; tagging and ownership
- Brand Management: multi-brand with compliance status and guidelines
- Content Workflows: Draft → Review → Approved → Published with reviewers
- Audit & Analytics: audit logs and analytics events
- Department Isolation: access control by department
- Q&A: questions with rich bodies and tagging (includes seeded FAQs)

### Technology
- Keystone 6
- Prisma (SQLite)
- TypeScript / Node.js
- Express (static assets)

---

## Getting Started

### Prerequisites
- Node.js v18+ and npm

### Install
```bash
npm install
```

### Development server
```bash
npm run dev
```
- Admin UI: [http://localhost:3000](http://localhost:3000)
- Login (first-run admin): `eliasisrael@adobe.com` / `12345678`
- First run seeds demo data; subsequent runs are idempotent (data is preserved).

### Seeded FAQs
- Questions are pre-seeded under the `Questions` list and marked as "Answered" so they persist across fresh clones. Topics include:
  - How Cursor safeguards source code and IP
  - How Cursor understands your codebase (library/index-cards metaphor)
  - Privacy Mode guarantees and how it is enforced
  - Client security model (VS Code fork / cherry-picked patches)
  - How to customize behavior via Rules (user vs project)
  - Deploying/managing Cursor across teams
  - Security & Privacy overview
  - How the TAM supports your team
  - Cursor vs Copilot/Codeium

### Build and start
```bash
npm run build
npm start
```

---

## Data & Persistence

- Database: SQLite at `./keystone.db` (can be overridden via `DATABASE_URL`).
- Data persists across restarts. Seeding only adds missing baseline records (ensures a super admin exists).
- Reset (optional):
```bash
rm -f keystone.db
npm run dev
```
This will reseed the demo, including the curated FAQs.

---

## Files and Images

- Files served from `public/files` at `/files`.
- Images served from `public/images` at `/images`.
- Max upload size: 40Mb.

---

## Scripts

- `npm run dev` — Start Keystone in development
- `npm run build` — Build the project
- `npm start` — Start the built server
- `npm run seed-data` — Run the seed routine explicitly
- `postinstall` — Keystone postinstall

---

## Cursor Agent Rules

- Always initialize the server upon opening this project:
  - Run `npm install` if dependencies are not installed
  - Run `npm run dev` and wait for the Admin UI at http://localhost:3000
  - Verify seeding completes without errors and the Admin UI is accessible
- Maintain schema stability:
  - Do not edit `schema.prisma` directly; update lists/fields in `schema.ts` and let Keystone regenerate
  - Avoid introducing Prisma/GraphQL/schema errors
- Environment details:
  - App port: 3000; Prisma Studio (if used) default port: 5555
  - Database path: `./keystone.db` (override via `DATABASE_URL`)
- Shut down cleanly: Ctrl+C in terminals running the server and tooling

- Project Rules (Cursor):
  - `@analyze-app`: runs `npm run dev`, collects console logs, and suggests performance improvements.
  - `@generate-docs`: extracts code comments, analyzes `README.md`, and writes markdown docs to `docs/`.
  - Note: Uses Project Rules in `.cursor/rules` (legacy `.cursorrules` is deprecated).

---

## Troubleshooting

- Dev loading page warning (benign during local dev):
  ```
  Error: ENOENT: no such file or directory, stat '.../node_modules/@keystone-6/core/scripts/cli/static/dev-loading.html'
  ```
  This can appear while the Admin UI is building locally. It is safe to ignore if the Admin UI proceeds to compile and load.

- Port in use:
```bash
lsof -ti :3000 | xargs kill -9
```

- Temporary ENOENT on `/signin` during Admin UI build:
  - If you briefly see an `ENOENT ... dev-loading.html` error while the Admin UI compiles, wait a moment and refresh once the UI reports ready in the terminal.

- Prisma Studio:
```bash
DATABASE_URL="file:./keystone.db" npx prisma generate
DATABASE_URL="file:./keystone.db" npx prisma studio
```
