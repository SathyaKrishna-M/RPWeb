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

/**
 * Confirms a character may be written as in this world.
 *
 * Membership of the world, not ownership of the character, is what grants
 * this. A world's cast is shared, so both writers can voice any character in
 * the story — which is the point, and also what stops each person quietly
 * creating their own copy of a character that already exists.
 */
export async function requireCastCharacter(
  userId: string,
  worldId: string,
  characterId: string
) {
  if (!characterId) throw new Error("A character is required")
  await requireWorldMembership(userId, worldId)

  const inCast = await prisma.worldCharacter.findUnique({
    where: { worldId_characterId: { worldId, characterId } },
    select: { characterId: true },
  })
  if (!inCast) throw new Error("That character is not part of this world")
  return characterId
}

/**
 * Confirms the user may customise a character: they created it, or they share
 * a world with it. Appearance is common property once a character is in a
 * shared cast — everyone sees the same avatar and colour.
 */
export async function requireEditableCharacter(userId: string, characterId: string) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { id: true, userId: true },
  })
  if (!character) throw new Error("Character not found")
  if (character.userId === userId) return character.id

  const shared = await prisma.worldCharacter.findFirst({
    where: { characterId, world: { members: { some: { userId } } } },
    select: { id: true },
  })
  if (!shared) throw new Error("Character not found")
  return character.id
}
