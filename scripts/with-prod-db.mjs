#!/usr/bin/env node
/**
 * Runs a command against the production database.
 *
 * Local development points DATABASE_URL at Docker, so applying a schema change
 * to production used to mean editing .env, remembering to run the push, and
 * editing it back. Forgetting the middle step ships code that selects a column
 * the live database does not have, and every page using it fails.
 *
 * Reads PRODUCTION_DATABASE_URL from .env and runs the command with that as
 * DATABASE_URL, so production work is explicit and one command.
 *
 *   npm run db:push:prod
 *   npm run backup
 */
import { spawnSync } from "node:child_process"

const url = process.env.PRODUCTION_DATABASE_URL
if (!url) {
  console.error(
    "PRODUCTION_DATABASE_URL is not set.\n" +
      "  Add it to .env — the Neon connection string for the live database.\n" +
      "  See DEPLOYMENT.md."
  )
  process.exit(1)
}

const [command, ...args] = process.argv.slice(2)
if (!command) {
  console.error("usage: node scripts/with-prod-db.mjs <command> [args...]")
  process.exit(1)
}

const host = url.replace(/\/\/[^@]*@/, "//****@").replace(/\?.*$/, "")
console.log(`→ against production: ${host}\n`)

const result = spawnSync(command, args, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DATABASE_URL: url },
})
process.exit(result.status ?? 1)
