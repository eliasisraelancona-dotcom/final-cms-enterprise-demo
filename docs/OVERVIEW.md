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

## How to Run
- Install: `npm install`
- Dev: `npm run dev` → Admin UI: http://localhost:3000
- First-run seeds demo data, idempotent on subsequent runs

## Data & Files
- DB: SQLite at `./keystone.db` (override with `DATABASE_URL`)
- Files: `public/files` → `/files`
- Images: `public/images` → `/images`

