/** Emails are matched case-insensitively so "Me@X.com" and "me@x.com" are one account. */
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export const MIN_PASSWORD_LENGTH = 8

export function validateRegistration(input: {
  name?: unknown
  email?: unknown
  password?: unknown
}): { ok: true; name: string; email: string; password: string } | { ok: false; error: string } {
  const name = typeof input.name === "string" ? input.name.trim() : ""
  const email = typeof input.email === "string" ? normalizeEmail(input.email) : ""
  const password = typeof input.password === "string" ? input.password : ""

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." }
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }
  }
  return { ok: true, name, email, password }
}
