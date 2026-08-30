import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/** Resolves the signed-in user id, or throws. */
export async function requireUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  return session.user.id
}

/**
 * Confirms the character exists and belongs to `userId`.
 *
 * Character ids arrive from client-submitted forms and payloads, so without
 * this check a user could join a world — or post — as somebody else's
 * character just by editing the id in the request.
 */
export async function requireOwnedCharacter(userId: string, characterId: string) {
  if (!characterId) throw new Error("A character is required")

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { id: true, userId: true },
  })

  if (!character || character.userId !== userId) {
    throw new Error("Character not found")
  }
  return character.id
}

/** Confirms the user is a member of the world, returning their membership. */
export async function requireWorldMembership(userId: string, worldId: string) {
  const member = await prisma.worldMember.findUnique({
    where: { worldId_userId: { worldId, userId } },
  })
  if (!member) throw new Error("Not a member of this world")
  return member
}
