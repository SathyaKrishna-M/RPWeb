"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireUserId, requireOwnedCharacter } from "@/server/auth-guards"
import { generateInviteCode } from "@/lib/invite-code"

type ParsedMessage = {
  sender: string
  text: string
  timestamp: string
}

export type NewCharacterDef = {
  telegramName: string
  name: string
  avatarUrl: string
  bio: string
}

/** Guard rails so a malformed or hostile payload cannot exhaust the database. */
const MAX_IMPORT_MESSAGES = 50_000
const MAX_MESSAGE_LENGTH = 20_000

export async function processTelegramImport(
  worldName: string,
  worldDescription: string,
  messages: ParsedMessage[],
  characterMap: Record<string, string>, // telegramName -> characterId | "SKIP" | "CREATE_NEW"
  newCharacters: NewCharacterDef[],
  myCharacterId: string
) {
  const userId = await requireUserId()

  const name = worldName?.trim()
  if (!name) throw new Error("World name is required")
  if (!Array.isArray(messages)) throw new Error("No messages to import")
  if (messages.length > MAX_IMPORT_MESSAGES) {
    throw new Error(`That export is too large (max ${MAX_IMPORT_MESSAGES.toLocaleString()} messages)`)
  }

  // 1. Create the characters the wizard asked for.
  const createdCharIds: Record<string, string> = {}
  for (const newChar of newCharacters) {
    const charName = newChar.name?.trim()
    if (!charName) throw new Error("New characters need a name")

    const char = await prisma.character.create({
      data: {
        userId,
        name: charName,
        avatarUrl: newChar.avatarUrl?.trim() || null,
        bio: newChar.bio?.trim() || null,
      },
    })
    createdCharIds[newChar.telegramName] = char.id
  }

  // 2. Resolve "CREATE_NEW" placeholders to the ids just created.
  const finalCharacterMap = { ...characterMap }
  for (const [telegramName, mappedVal] of Object.entries(finalCharacterMap)) {
    if (mappedVal === "CREATE_NEW" && createdCharIds[telegramName]) {
      finalCharacterMap[telegramName] = createdCharIds[telegramName]
    }
  }

  let resolvedMyCharacterId = myCharacterId
  if (myCharacterId?.startsWith("NEW_")) {
    const telegramName = myCharacterId.slice("NEW_".length)
    resolvedMyCharacterId = createdCharIds[telegramName] ?? ""
  }

  // Every character referenced must belong to the importer — both the one they
  // play as and each one messages are attributed to.
  const ownedMyCharacterId = await requireOwnedCharacter(userId, resolvedMyCharacterId)

  const referencedIds = new Set(
    Object.values(finalCharacterMap).filter((v) => v && v !== "SKIP" && v !== "CREATE_NEW")
  )
  for (const characterId of referencedIds) {
    await requireOwnedCharacter(userId, characterId)
  }

  // 3. Create the world with the importer as owner.
  const world = await prisma.world.create({
    data: {
      name,
      description: worldDescription?.trim() || "Imported from Telegram",
      inviteCode: await generateInviteCode(),
      ownerId: userId,
      members: {
        create: {
          userId,
          characterId: ownedMyCharacterId,
          role: "OWNER",
        },
      },
    },
  })

  await prisma.telegramImport.create({
    data: {
      worldId: world.id,
      uploadedBy: userId,
      status: "COMPLETED",
    },
  })

  // 4. Bulk insert the messages.
  const messageData = messages.flatMap((msg) => {
    const charId = finalCharacterMap[msg.sender]
    if (!charId || charId === "SKIP" || charId === "CREATE_NEW") return []

    const content = typeof msg.text === "string" ? msg.text.slice(0, MAX_MESSAGE_LENGTH) : ""
    if (!content.trim()) return []

    const timestamp = new Date(msg.timestamp)
    return [
      {
        worldId: world.id,
        characterId: charId,
        content,
        format: "NARRATION",
        timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
        isImported: true,
      },
    ]
  })

  const chunkSize = 1000
  for (let i = 0; i < messageData.length; i += chunkSize) {
    await prisma.message.createMany({ data: messageData.slice(i, i + chunkSize) })
  }

  revalidatePath("/dashboard")
  revalidatePath("/worlds")
  return world.id
}
