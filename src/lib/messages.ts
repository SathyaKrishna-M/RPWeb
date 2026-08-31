import type { Character, Message } from "@prisma/client"

/** How many messages the chat loads per page. */
export const MESSAGE_PAGE_SIZE = 200

/** Messages are long-form prose, but not unbounded. */
export const MAX_MESSAGE_LENGTH = 20_000

/** The four ways a line can be styled. Stored in `Message.format`. */
export const MESSAGE_FORMATS = ["DIALOGUE", "ACTION", "THOUGHT", "NARRATION"] as const
export type MessageFormat = (typeof MESSAGE_FORMATS)[number]

/**
 * Written before the composer let you choose a format, when everything was
 * saved as MIXED and the styling was inferred from the punctuation. Existing
 * rows still carry it, so the renderer must keep understanding it.
 */
export const LEGACY_MIXED_FORMAT = "MIXED"

/**
 * What may be written to `Message.format`.
 *
 * MIXED is what the composer stores now: a post can hold speech, action and
 * thought at once, and which is which lives in the markers inside the text.
 * The four single kinds remain valid for imported history and for messages
 * written before one post could mix them.
 */
export const STORED_FORMATS = [LEGACY_MIXED_FORMAT, ...MESSAGE_FORMATS] as const

export function isStoredFormat(value: string) {
  return (STORED_FORMATS as readonly string[]).includes(value)
}

/** The message shape sent to the browser: dates as ISO strings, no extra fields. */
export type SerializedMessage = {
  id: string
  worldId: string
  content: string
  format: string
  timestamp: string
  isImported: boolean
  editedAt: string | null
  /** Advances on every change, and drives the polling cursor. */
  updatedAt: string
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
    editedAt: message.editedAt?.toISOString() ?? null,
    updatedAt: message.updatedAt.toISOString(),
    character: {
      id: message.character.id,
      name: message.character.name,
      avatarUrl: message.character.avatarUrl,
    },
  }
}

/** A stable hue per character, used for name colour and the accent bar. */
export function characterHue(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}
