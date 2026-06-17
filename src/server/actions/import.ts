"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomBytes } from "crypto"

type ParsedMessage = {
  sender: string;
  text: string;
  timestamp: string;
};

export type NewCharacterDef = {
  telegramName: string;
  name: string;
  avatarUrl: string;
  bio: string;
};

export async function processTelegramImport(
  worldName: string,
  worldDescription: string,
  messages: ParsedMessage[],
  characterMap: Record<string, string>, // telegramName -> characterId
  newCharacters: NewCharacterDef[],
  myCharacterId: string
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // 1. Create New Characters
  const createdCharIds: Record<string, string> = {}
  for (const newChar of newCharacters) {
    const char = await prisma.character.create({
      data: {
        userId: session.user.id,
        name: newChar.name,
        avatarUrl: newChar.avatarUrl || null,
        bio: newChar.bio || null,
      }
    })
    createdCharIds[newChar.telegramName] = char.id
  }

  // Update character map with newly created character IDs
  const finalCharacterMap = { ...characterMap }
  for (const [telegramName, mappedVal] of Object.entries(finalCharacterMap)) {
    if (mappedVal === "CREATE_NEW" && createdCharIds[telegramName]) {
      finalCharacterMap[telegramName] = createdCharIds[telegramName]
      
      // If the user selected to play as this newly created character
      if (myCharacterId === `NEW_${telegramName}`) {
        myCharacterId = createdCharIds[telegramName]
      }
    }
  }

  const inviteCode = randomBytes(3).toString("hex").toUpperCase()

  // 2. Create the world
  const world = await prisma.world.create({
    data: {
      name: worldName,
      description: worldDescription || "Imported from Telegram",
      inviteCode,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          characterId: myCharacterId,
          role: "OWNER"
        }
      }
    }
  })

  // 3. Create the import record
  await prisma.telegramImport.create({
    data: {
      worldId: world.id,
      uploadedBy: session.user.id,
      status: "COMPLETED"
    }
  })

  // 4. Bulk insert messages
  const messageData = messages
    .map(msg => {
      const charId = finalCharacterMap[msg.sender];
      if (!charId || charId === "SKIP") return null;

      return {
        worldId: world.id,
        characterId: charId,
        content: msg.text,
        format: "NARRATION",
        timestamp: new Date(msg.timestamp),
        isImported: true,
      };
    })
    .filter(Boolean) as any[];

  if (messageData.length > 0) {
    const chunkSize = 1000;
    for (let i = 0; i < messageData.length; i += chunkSize) {
      const chunk = messageData.slice(i, i + chunkSize);
      await prisma.message.createMany({
        data: chunk
      });
    }
  }

  revalidatePath("/dashboard")
  return world.id // Return world ID instead of redirecting so client can handle it
}
