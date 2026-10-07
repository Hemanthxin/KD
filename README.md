# Krateus Dynamic Solutions — Lead Workspace

Internal workspace for managing website leads: admins upload businesses that
don't have a website, workers claim and contact them, and progress is tracked
through to conversion.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **Prisma 7** + SQLite (via `@prisma/adapter-better-sqlite3`) — swap the
  adapter/datasource for Postgres or another engine in production if needed
- **Tailwind CSS v4**
- Session auth via signed JWT in an httpOnly cookie (no third-party auth
  provider)

## Getting started

```bash
npm install
npm run db:push    # create/sync the SQLite schema
npm run db:seed     # create the admin account from .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Accounts

- **Admin** — credentials come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`),
  created by `npm run db:seed`. There is no admin signup page — only the
  login at `/login/admin`.
- **Workers** — admins create worker accounts from `/admin/workers`. There is
  no public worker signup; workers sign in at `/login/worker` once an admin
  has added them.

## How it works

1. **Admin uploads leads** at `/admin/leads/upload` — a CSV, `.xlsx`, or
   `.xls` file with business leads (name + phone/email at minimum). Column
   order and naming are flexible; headers are matched case-insensitively.
2. **Workers accept leads** from `/worker/available` — first to accept owns
   it and it moves to their "My Leads" list.
3. **Workers update progress** on `/worker/leads/[id]` — add notes and move
   the lead to *Completed* (converted to a client) or *Not Interested*.
4. **Admin sees everything** on `/admin/leads` and `/admin/workers` — which
   worker has which lead, current status, and the full activity timeline per
   lead (`/admin/leads/[id]`).

## Useful scripts

```bash
npm run db:push     # sync prisma/schema.prisma to the SQLite db
npm run db:seed      # (re)create the admin account from .env
npm run db:studio    # browse the database in Prisma Studio
npm run build        # production build
npm run lint          # eslint
```

## Notes

- `prisma.config.ts` holds the datasource URL (Prisma 7 no longer reads it
  from `schema.prisma` directly); `.env`'s `DATABASE_URL` feeds it.
- The SQLite file lives at `prisma/dev.db` and is gitignored.
- Branding (logo, name, colors) is pulled from
  [krateus-dynamics.web.app](https://krateus-dynamics.web.app).
