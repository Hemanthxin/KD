# Krateus Dynamic Solutions — Lead Workspace

Internal workspace for managing website leads: admins upload businesses that
don't have a website, workers claim and contact them, and progress is tracked
through to conversion.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions)
- **Prisma 7** + Postgres (via `@prisma/adapter-pg`) — works with any hosted
  Postgres (Neon, Supabase, Vercel Postgres, Railway, etc.)
- **Tailwind CSS v4**
- Session auth via signed JWT in an httpOnly cookie (no third-party auth
  provider)

## Getting started

1. Create a free Postgres database (e.g. at [neon.com](https://neon.com) or
   [supabase.com](https://supabase.com)) and copy its connection string.
2. Set `DATABASE_URL` in `.env` to that connection string.
3. Run:

```bash
npm install
npm run db:push    # create/sync the schema
npm run db:seed     # create the admin account from .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploying to Vercel

Set these environment variables in the Vercel project settings (Settings →
Environment Variables), then deploy:

- `DATABASE_URL` — your Postgres connection string
- `SESSION_SECRET` — a long random string (same one works for all envs, or
  generate a fresh one per environment)
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — used only when you run the
  seed script

After the first deploy, run `npm run db:push && npm run db:seed` once
against the production `DATABASE_URL` (locally, with `.env` pointed at the
production database, or via `vercel env pull`) to create the schema and the
admin account.

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
npm run db:push     # sync prisma/schema.prisma to the database
npm run db:seed      # (re)create the admin account from .env
npm run db:studio    # browse the database in Prisma Studio
npm run build        # production build
npm run lint          # eslint
```

## Notes

- `prisma.config.ts` holds the datasource URL (Prisma 7 no longer reads it
  from `schema.prisma` directly); `.env`'s `DATABASE_URL` feeds it.
- `postinstall` runs `prisma generate` automatically after `npm install` —
  required for both local dev and Vercel builds.
- Branding (logo, name, colors) is pulled from
  [krateus-dynamics.web.app](https://krateus-dynamics.web.app).
