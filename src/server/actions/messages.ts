"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function createMessage(worldId: string, content: string, format: string, overrideCharacterId?: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const member = await prisma.worldMember.findUnique({
    where: {
      worldId_userId: {
        worldId,
        userId: session.user.id
      }
    }
  })

  if (!member) throw new Error("Not a member of this world")

  let targetCharacterId = member.characterId

  if (overrideCharacterId && overrideCharacterId !== member.characterId) {
    // Verify the user owns this override character
    const char = await prisma.character.findUnique({
      where: { id: overrideCharacterId }
    })
    if (!char || char.userId !== session.user.id) {
      throw new Error("Unauthorized to use this character")
    }
    targetCharacterId = overrideCharacterId
  }

  const message = await prisma.message.create({
    data: {
      worldId,
      characterId: targetCharacterId,
      content,
      format,
    },
    include: {
      character: true
    }
  })

  return message;
}
