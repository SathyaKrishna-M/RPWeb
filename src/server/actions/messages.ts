"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function createMessage(worldId: string, content: string, format: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const member = await prisma.worldMember.findUnique({
    where: {
      worldId_userId: {
        worldId,
        userId: session.user.id
      }
    },
    include: {
      character: true
    }
  })

  if (!member) throw new Error("Not a member of this world")

  const message = await prisma.message.create({
    data: {
      worldId,
      characterId: member.characterId,
      content,
      format,
    },
    include: {
      character: true
    }
  })

  return message;
}
