"use server"

import { prisma } from "@/lib/prisma"
import { requireUserId, requireOwnedCharacter, requireWorldMembership } from "@/server/auth-guards"
import { broadcastToWorld } from "@/server/realtime"
import {
  serializeMessage,
  MESSAGE_PAGE_SIZE,
  MAX_MESSAGE_LENGTH,
  type SerializedMessage,
} from "@/lib/messages"

export async function createMessage(
  worldId: string,
  content: string,
  format: string,
  overrideCharacterId?: string,
  senderSocketId?: string
): Promise<SerializedMessage> {
  const userId = await requireUserId()
  const member = await requireWorldMembership(userId, worldId)

  const trimmed = content?.trim() ?? ""
  if (!trimmed) throw new Error("Message cannot be empty")
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`)
  }

  let targetCharacterId = member.characterId
  if (overrideCharacterId && overrideCharacterId !== member.characterId) {
    targetCharacterId = await requireOwnedCharacter(userId, overrideCharacterId)
  }

  const message = await prisma.message.create({
    data: {
      worldId,
      characterId: targetCharacterId,
      content: trimmed,
      format,
    },
    include: { character: true },
  })

  const serialized = serializeMessage(message)

  // Broadcast from the server, after the write. Clients are not trusted to
  // announce their own messages, so nothing can be injected into a world by a
  // crafted socket payload. The sender is excluded because it already renders
  // the message optimistically; an echo would briefly show it twice.
  broadcastToWorld(worldId, "new-message", serialized, senderSocketId)

  return serialized
}

/**
 * Messages newer than `afterTimestamp`, used to catch up after a dropped
 * socket connection so nothing written while offline is missed.
 */
export async function fetchMessagesSince(
  worldId: string,
  afterTimestamp: string
): Promise<SerializedMessage[]> {
  const userId = await requireUserId()
  await requireWorldMembership(userId, worldId)

  const after = new Date(afterTimestamp)
  if (Number.isNaN(after.getTime())) throw new Error("Invalid timestamp")

  const messages = await prisma.message.findMany({
    where: { worldId, timestamp: { gt: after } },
    orderBy: { timestamp: "asc" },
    include: { character: true },
    take: 500,
  })

  return messages.map(serializeMessage)
}

/** The page of messages immediately before `beforeTimestamp`, oldest first. */
export async function fetchOlderMessages(
  worldId: string,
  beforeTimestamp: string
): Promise<{ messages: SerializedMessage[]; hasMore: boolean }> {
  const userId = await requireUserId()
  await requireWorldMembership(userId, worldId)

  const before = new Date(beforeTimestamp)
  if (Number.isNaN(before.getTime())) throw new Error("Invalid timestamp")

  const messages = await prisma.message.findMany({
    where: { worldId, timestamp: { lt: before } },
    orderBy: { timestamp: "desc" },
    include: { character: true },
    take: MESSAGE_PAGE_SIZE + 1,
  })

  const hasMore = messages.length > MESSAGE_PAGE_SIZE
  const page = hasMore ? messages.slice(0, MESSAGE_PAGE_SIZE) : messages

  return { messages: page.reverse().map(serializeMessage), hasMore }
}
