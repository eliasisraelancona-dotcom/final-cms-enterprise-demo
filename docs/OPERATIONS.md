# Operations

## Setup
- Node v18+, `npm install`
- Dev: `npm run dev` (wait for Admin UI to compile)
- Build: `npm run build`, Start: `npm start`

## Ports & Paths
- App: 3000
- Prisma Studio (if used): 5555
- DB: `./keystone.db`

## Environment
- `DATABASE_URL="file:./keystone.db"` (default for local)
- Safe to delete `keystone.db` to reset demo data locally

## Maintenance
- Reset DB:
  ```bash
  rm -f keystone.db
  npm run dev
  ```
- Prisma Studio:
  ```bash
  DATABASE_URL="file:./keystone.db" npx prisma generate
  DATABASE_URL="file:./keystone.db" npx prisma studio
  ```

## Troubleshooting
- Temporary dev-loading warning from Keystone Admin build is benign if UI proceeds.
- Port in use:
  ```bash
  lsof -ti :3000 | xargs kill -9
  ```

