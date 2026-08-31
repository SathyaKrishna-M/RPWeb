# RPWeb

A private roleplay platform. Create characters, share a world with a partner via
an invite code, and write together in real time. Existing Telegram roleplays can
be imported from an HTML export and continued in place.

Built with Next.js 16 (App Router), React 19, Prisma + PostgreSQL and Auth.js v5.
Deployed on Vercel with a Neon database.

---

## Where the writing is kept

The live database is **Neon** (free plan, no expiry). Because no free plan is
guaranteed forever, every world is also backed up into a **private git repo** —
`npm run backup` — so the story survives the database. See
[BACKUPS.md](BACKUPS.md); set this up before you write anything you care about.

You can also export any single world from **Settings → Export**, or the
**Export** button in a world's header, as JSON or a readable HTML transcript.

## Local development

Requires Node.js 20+ and either Docker (for a local PostgreSQL) or a Neon URL.

```bash
cp .env.example .env
```

Generate a secret and paste it into `.env` as `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Start PostgreSQL:

```bash
docker compose up -d
```

> Keep `DATABASE_URL` pointed at this local database while developing. Running
> the app locally against Neon opens a pool of connections on every restart, and
> a force-killed dev server leaves them behind until they time out — enough
> restarts and the free plan runs out of connections and every query fails with
> `P2024`. Swap the Neon URL in only for `npm run db:push` after a schema change
> or for `npm run backup`.

Install, create the schema, and run:

```bash
npm install && npx prisma db push && npm run dev
```

The app is at http://localhost:3000.

If port 3000 is already taken (a local PostgreSQL install, for instance, can be
configured to sit on it), run on another port — Auth.js derives its origin from
the request, so nothing else needs changing:

```bash
npm run dev -- -p 3001
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Production server (`next start`) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply `prisma/schema.prisma` to the **local** database |
| `npm run db:push:prod` | Apply it to **production** (Neon) |
| `npm run db:studio` | Browse the database |
| `npm run backup` | Export every world from production to `backups/` and commit |

## Deploying

See [DEPLOYMENT.md](DEPLOYMENT.md). The short version: create a free
[Neon](https://neon.com) database, run `npm run db:push` against it, then import
the repo at [vercel.com/new](https://vercel.com/new) with two environment
variables — `DATABASE_URL` (Neon's **pooled** URL) and `AUTH_SECRET`.

## How it fits together

| Path | Role |
| --- | --- |
| [src/auth.ts](src/auth.ts) | Auth.js config (credentials, JWT sessions) |
| [src/server/actions/](src/server/actions/) | All mutations, as Server Actions |
| [src/server/auth-guards.ts](src/server/auth-guards.ts) | Session, character-ownership, and membership checks |
| [prisma/schema.prisma](prisma/schema.prisma) | Data model |
| [scripts/backup.mjs](scripts/backup.mjs) | Exports every world and commits it to a backup repo |

### Realtime

The chat polls rather than holding a socket, because Vercel runs no long-lived
process. Every few seconds the client calls `fetchMessagesSince` for anything
newer than what it already shows; the interval widens as a world goes quiet and
stops altogether while the tab is hidden, so an open tab cannot hold the
database awake. Each call re-checks that the caller is a member of the world.
See [DEPLOYMENT.md](DEPLOYMENT.md) for the intervals.

### Writing format

A single message can hold several kinds at once, which is how roleplay is
actually written. Markers inside the text decide which is which:

| Written | Reads as |
| --- | --- |
| `"spoken words"` | dialogue |
| `*performed*` | action |
| `**thought**` | thought |
| anything else | narration |

The composer's **Mark as** buttons wrap the selected words for you, and a
preview shows how the message will read before it is sent. Each line is
labelled in the chat with what it is, so a post mixing speech, action and
thought stays readable. Imported Telegram history uses the same quote
convention, so it is labelled correctly without being touched.
