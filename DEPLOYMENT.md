# Deploying RPWeb

Two free services: **Neon** for the database, **Render** for the app.

Neon rather than Render's own PostgreSQL because Render's free database is
deleted 30 days after it is created, with no backups. Neon's free plan has no
such expiry and suspends to zero when idle, waking automatically on the next
connection — which suits a roleplay that goes quiet for a while.

Free is still not a guarantee. Set up [BACKUPS.md](BACKUPS.md) as well; that is
what actually makes the chat permanent.

---

## 1. Create the database (Neon)

1. Sign up at [neon.com](https://neon.com) and create a project.
2. Copy the **connection string** — it looks like
   `postgresql://user:password@ep-something.region.aws.neon.tech/dbname?sslmode=require`.
3. Prefer the **direct** (non-pooled) connection string. This app runs as one
   long-lived Node server with its own connection pool, so it does not need
   Neon's pooler, and the direct URL avoids prepared-statement issues.

Free plan at time of writing: 0.5 GB storage, which is a very large amount of
prose — hundreds of thousands of messages.

## 2. Deploy the app (Render)

1. Push this repo to GitHub.
2. Render Dashboard → **New +** → **Blueprint**, and connect the repo. It reads
   [render.yaml](render.yaml).
3. **Apply.** The blueprint creates one web service, `rpweb`.
4. Open the service → **Environment** → add:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | your Neon connection string |

   Everything else — `AUTH_SECRET`, `AUTH_TRUST_HOST`, `NODE_ENV` — is set by
   the blueprint.

   > **Paste the bare URL only.** Neon shows the string inside a ready-to-run
   > `psql '...'` command; copying that whole line in is the most common way to
   > break the build. The value must start with `postgresql://` — no `psql`
   > prefix, no surrounding quotes:
   >
   > ```
   > postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require&channel_binding=require
   > ```
   >
   > The build runs `node scripts/check-env.mjs` before touching Prisma, so a
   > malformed value fails immediately with an explanation rather than a Prisma
   > schema-validation dump.

The build runs `prisma db push`, so the tables are created on the first deploy.
No manual migration step.

### Why `AUTH_TRUST_HOST` matters

Auth.js only trusts the incoming `Host` header when it recognises the platform
(Vercel, Cloudflare) or when `AUTH_URL` / `AUTH_TRUST_HOST` is set. Note that
`NEXTAUTH_URL` is **not** on that list. On Render in production, without this,
every sign-in fails with `UntrustedHost`. The app also sets `trustHost: true` in
[src/auth.ts](src/auth.ts) so it holds on any host.

Set `NEXTAUTH_URL` only if you attach a custom domain, and then to the full
origin (`https://your-domain.com`). Leaving it unset lets Auth.js derive the
origin from the request, which is what you want on a `*.onrender.com` URL.

## 3. Set up backups

Follow [BACKUPS.md](BACKUPS.md). Until that is done, the chat exists in exactly
one place.

---

## What runs

- **Build**: `npm ci && npx prisma generate && npx prisma db push && npm run build`
- **Start**: `npm run start` → `node server.mjs`, binding Next.js and Socket.IO
  to Render's `PORT`.
- **Health check**: `/api/health`, which verifies the database is reachable, so
  a deploy that cannot reach Postgres is not rolled out as healthy.

## Known free-tier behaviour

- **Render free web service** spins down after 15 minutes of inactivity and
  takes roughly a minute to wake. The first page load after a quiet spell is
  slow; nothing is lost.
- **Neon free** suspends compute when idle and resumes on connection. The first
  query after idling takes a moment.

Neither loses data. Both are cosmetic delays.

## Moving the database later

Because the app talks to plain PostgreSQL through Prisma, moving providers is
just a new `DATABASE_URL` plus `npx prisma db push`. To carry existing data:

```bash
pg_dump "$OLD_DATABASE_URL" --no-owner --format=custom -f rpweb.dump
```

```bash
pg_restore --no-owner -d "$NEW_DATABASE_URL" rpweb.dump
```
