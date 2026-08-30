#!/usr/bin/env node
/**
 * Validates deployment environment variables before the build touches Prisma.
 *
 * Without this, a malformed DATABASE_URL surfaces as a Prisma wasm validation
 * dump partway through the build, which says nothing about how to fix it. The
 * most common cause is pasting a whole `psql '...'` command — or a quoted
 * string — into the dashboard instead of the bare URL.
 */

const problems = []
const warnings = []

const raw = process.env.DATABASE_URL

if (!raw) {
  problems.push(
    "DATABASE_URL is not set.\n" +
      "    Set it in your host's dashboard (Render: service -> Environment) to your\n" +
      "    Postgres connection string."
  )
} else {
  const trimmed = raw.trim()

  if (/^psql\b/i.test(trimmed)) {
    problems.push(
      "DATABASE_URL starts with `psql`, so it is a shell command, not a URL.\n" +
        "    Paste only the connection string itself — everything from `postgresql://`\n" +
        "    onwards, with no `psql` prefix and no surrounding quotes."
    )
  } else if (/^['"]/.test(trimmed)) {
    problems.push(
      "DATABASE_URL is wrapped in quotes.\n" +
        "    Dashboard values are already literal — remove the surrounding ' or \" characters."
    )
  } else if (!/^postgres(ql)?:\/\//.test(trimmed)) {
    problems.push(
      `DATABASE_URL does not start with postgresql:// or postgres:// (starts with ${JSON.stringify(
        trimmed.slice(0, 12)
      )}).`
    )
  } else {
    if (trimmed !== raw) {
      warnings.push("DATABASE_URL has leading or trailing whitespace, which some clients keep.")
    }
    // Neon's pooled endpoint needs ?pgbouncer=true for Prisma, and `prisma db
    // push` needs a direct connection. The direct endpoint avoids both issues.
    if (trimmed.includes("-pooler.") && !trimmed.includes("pgbouncer=true")) {
      warnings.push(
        "DATABASE_URL points at a pooled endpoint (-pooler) without ?pgbouncer=true.\n" +
          "    Prefer the direct endpoint (drop `-pooler` from the host) — schema pushes\n" +
          "    require a direct connection."
      )
    }
  }
}

if (process.env.NODE_ENV === "production") {
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    problems.push(
      "AUTH_SECRET is not set. Sessions cannot be signed.\n" +
        "    Generate one with:\n" +
        "    node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    )
  }
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (url && !/^https?:\/\//.test(url.trim())) {
    problems.push(`NEXTAUTH_URL/AUTH_URL must be a full origin including the scheme (got ${JSON.stringify(url)}).`)
  }
}

for (const warning of warnings) {
  console.warn(`  warning: ${warning}`)
}

if (problems.length > 0) {
  console.error("\nEnvironment is not usable:\n")
  for (const problem of problems) {
    console.error(`  - ${problem}\n`)
  }
  console.error("See DEPLOYMENT.md for the full list of variables.\n")
  process.exit(1)
}

console.log("Environment looks good.")
