# Keeping the chat forever

Everything written in this app lives in one PostgreSQL database. No free
database plan is guaranteed to last forever — Render's free Postgres is deleted
after 30 days, Supabase pauses free projects after a week of inactivity, and any
provider can change its terms. A previous version of this app lost its entire
history exactly this way.

So the chat is kept in **two** places:

| | Where | Why |
| --- | --- | --- |
| **Live** | Neon free Postgres | The app reads and writes here. Fast, realtime, multi-user. |
| **Permanent** | A **private** git repo | Copied to GitHub *and* to every machine you clone it on. Survives the database disappearing. |

Git is the durable half. Every clone is a complete copy, so the story exists in
as many places as you have checkouts.

> **This repo is public.** Backups must never be committed here. `backups/` is
> in `.gitignore` for exactly that reason. Point backups at a separate private
> repo.

---

## One-time setup

**1. Create a private backup repo** on GitHub — e.g. `RPWeb-backups`. Make sure
it is set to **Private**.

**2. Clone it into `backups/`** inside this project:

```bash
git clone git@github.com:YOUR-USERNAME/RPWeb-backups.git backups
```

**3. Point `DATABASE_URL` at the live database.** Use Neon's **direct**
(non-pooled) URL in `.env`, or pass it for a single run:

```bash
DATABASE_URL="postgresql://..." npm run backup
```

## Running a backup

```bash
npm run backup
```

It writes one `.json` (complete, re-importable) and one `.html` (readable
transcript) per world, then commits and pushes — but only when something
actually changed, so repeated runs don't create empty commits.

Because files are overwritten in place rather than timestamped, the folder stays
small and **git history holds every past version**. To read the story as it
stood at any point, check out an older commit.

Useful flags:

```bash
npm run backup -- --out ../somewhere-else
```

```bash
npm run backup -- --no-push
```

## Automatic backups

To back up on a schedule without remembering to, put this workflow in your
**private** backup repo at `.github/workflows/backup.yml`, and add your Neon
connection string as a repository secret named `DATABASE_URL`
(Settings → Secrets and variables → Actions → New repository secret).

GitHub Actions is free for private repos within the monthly minutes allowance,
and this job takes about a minute.

```yaml
name: Backup RPWeb

on:
  schedule:
    - cron: "0 3 * * *" # daily at 03:00 UTC
  workflow_dispatch: # also runnable by hand from the Actions tab

jobs:
  backup:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Check out the backup repo
        uses: actions/checkout@v4
        with:
          path: backups

      - name: Check out the app (for the backup script)
        uses: actions/checkout@v4
        with:
          repository: YOUR-USERNAME/RPWeb
          path: app

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install
        working-directory: app
        run: npm ci

      - name: Back up
        working-directory: app
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          git config --global user.name "github-actions"
          git config --global user.email "github-actions@github.com"
          node scripts/backup.mjs --out "$GITHUB_WORKSPACE/backups"
```

Replace `YOUR-USERNAME/RPWeb` with your actual repo path.

## Restoring

The `.json` files contain every field, including message ids, timestamps,
formats and character attribution. To read a backup, open the `.html` in any
browser — it needs nothing from this app, no server, and no database.

## Exporting a single world from the app

Signed in, go to **Settings → Export**, or use the **Export** button in a
world's header. Both give the same JSON and HTML.
