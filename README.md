# RPWeb

A private roleplay platform. Create characters, share a world with a partner via
an invite code, and write together in real time. Existing Telegram roleplays can
be imported from an HTML export and continued in place.

Built with Next.js 16 (App Router), React 19, Prisma + PostgreSQL, Auth.js v5,
and Socket.IO on a custom Node server.

---

## Where the writing is kept

The live database is **Neon** (free plan, no expiry). Because no free plan is
guaranteed forever, every world is also backed up into a **private git repo** —
`npm run backup` — so the story survives the database. See
[BACKUPS.md](BACKUPS.md); set this up before you write anything you care about.

You can also export any single world from **Settings → Export**, or the
**Export** button in a world's header, as JSON or a readable HTML transcript.

## Local development

Requires Node.js 20+ and Docker (for PostgreSQL).

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

Install, create the schema, and run:

```bash
npm install && npx prisma db push && npm run dev
```

The app is at http://localhost:3000. `npm run dev` runs `server.mjs`, not
`next dev` — the custom server is what hosts Socket.IO alongside Next.js, so
starting Next on its own means no realtime updates.

If port 3000 is already taken (a local PostgreSQL install, for instance, can be
configured to sit on it), run on another port — Auth.js derives its origin from
the request, so nothing else needs changing:

```bash
PORT=3001 npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server (Next + Socket.IO) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run typecheck` | TypeScript, no emit |
| `npm run lint` | ESLint |
| `npm run db:push` | Apply `prisma/schema.prisma` to the database |
| `npm run db:studio` | Browse the database |
| `npm run backup` | Export every world to `backups/` and commit it |

## Deploying

See [DEPLOYMENT.md](DEPLOYMENT.md). The short version: create a free
[Neon](https://neon.com) database, push to GitHub, create a Render **Blueprint**
from [render.yaml](render.yaml), and paste the Neon connection string in as
`DATABASE_URL`. The blueprint handles `AUTH_SECRET` and `AUTH_TRUST_HOST`.

## How it fits together

| Path | Role |
| --- | --- |
| [server.mjs](server.mjs) | Node server hosting Next.js + Socket.IO; authenticates sockets |
| [src/auth.ts](src/auth.ts) | Auth.js config (credentials, JWT sessions) |
| [src/server/actions/](src/server/actions/) | All mutations, as Server Actions |
| [src/server/auth-guards.ts](src/server/auth-guards.ts) | Session, character-ownership, and membership checks |
| [prisma/schema.prisma](prisma/schema.prisma) | Data model |
| [scripts/backup.mjs](scripts/backup.mjs) | Exports every world and commits it to a backup repo |

### Realtime

Clients never broadcast. A message is written by the `createMessage` Server
Action, which then emits it to the world's room from the server. Sockets
authenticate from the Auth.js session cookie on the handshake, and `join-world`
verifies membership before the socket can see anything.

### Writing format

Text is styled as it is typed: `"dialogue"`, `*action*`, `**thought**`, and
anything else as narration.
