# Adobe Enterprise CMS (Demo) — Overview

## Purpose
Enterprise-grade demo of DAM + CMS with RBAC, workflows, brand governance, and auditability.

## Tech Stack
- Keystone 6, TypeScript/Node.js
- Prisma (SQLite)
- Express (static assets)

## What’s Included
- RBAC with multiple roles and granular permissions
- Assets: upload, review, approve, archive; tagging and ownership
- Brand Management: multi-brand, compliance status/guidelines
- Content Workflows: Draft → Review → Approved → Published
- Audit & Analytics events
- Department isolation and Q&A with tagging

## Seeded FAQs
- The demo seeds a set of enterprise-focused questions (marked Answered) covering security/privacy, Privacy Mode guarantees, rules customization, enterprise rollout, and comparisons (Cursor vs Copilot/Codeium). These live under `Questions` in the Admin UI and persist across fresh clones via seeding.

## How to Run
- Install: `npm install`
- Dev: `npm run dev` → Admin UI: http://localhost:3000
- First-run seeds demo data, idempotent on subsequent runs
  - To reseed locally: delete `./keystone.db` and run `npm run dev` again

## Data & Files
- DB: SQLite at `./keystone.db` (override with `DATABASE_URL`)
- Files: `public/files` → `/files`
- Images: `public/images` → `/images`

