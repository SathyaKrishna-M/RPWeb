import type { Character, Message } from "@prisma/client"

/** How many messages the chat loads per page. */
export const MESSAGE_PAGE_SIZE = 200

/** Messages are long-form prose, but not unbounded. */
export const MAX_MESSAGE_LENGTH = 20_000

/** The message shape sent to the browser: dates as ISO strings, no extra fields. */
export type SerializedMessage = {
  id: string
  worldId: string
  content: string
  format: string
  timestamp: string
  isImported: boolean
  character: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

export function serializeMessage(message: Message & { character: Character }): SerializedMessage {
  return {
    id: message.id,
    worldId: message.worldId,
    content: message.content,
    format: message.format,
    timestamp: message.timestamp.toISOString(),
    isImported: message.isImported,
    character: {
      id: message.character.id,
      name: message.character.name,
      avatarUrl: message.character.avatarUrl,
    },
  }
}
