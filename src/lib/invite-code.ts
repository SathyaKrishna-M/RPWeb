import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"

/**
 * A 6-character code. `inviteCode` is unique in the schema, so a collision
 * would otherwise surface as an opaque write failure; retry a few times first.
 */
export async function generateInviteCode(attempts = 5): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    const code = randomBytes(3).toString("hex").toUpperCase()
    const clash = await prisma.world.findUnique({
      where: { inviteCode: code },
      select: { id: true },
    })
    if (!clash) return code
  }
  // Vanishingly unlikely; fall back to a longer code rather than failing.
  return randomBytes(6).toString("hex").toUpperCase()
}
