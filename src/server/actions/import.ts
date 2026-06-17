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

export async function processTelegramImport(
  worldName: string,
  messages: ParsedMessage[],
  characterMap: Record<string, string>, // telegramName -> characterId
  myCharacterId: string
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const inviteCode = randomBytes(3).toString("hex").toUpperCase()

  // Create the world
  const world = await prisma.world.create({
    data: {
      name: worldName,
      description: "Imported from Telegram",
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

  // Create the import record
  await prisma.telegramImport.create({
    data: {
      worldId: world.id,
      uploadedBy: session.user.id,
      status: "COMPLETED"
    }
  })

  // Bulk insert messages
  // We will map sender to characterId. If a sender is not mapped, we might skip or map to a default.
  // Wait, if it's not mapped, we skip it (or maybe it shouldn't happen if UI enforces it).
  const messageData = messages
    .map(msg => {
      const charId = characterMap[msg.sender];
      if (!charId) return null;

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
    // Prisma bulk insert (sqlite limits variables so we might chunk, but let's try direct first)
    // Actually, chunking is safer.
    const chunkSize = 1000;
    for (let i = 0; i < messageData.length; i += chunkSize) {
      const chunk = messageData.slice(i, i + chunkSize);
      await prisma.message.createMany({
        data: chunk
      });
    }
  }

  revalidatePath("/dashboard")
  redirect(`/worlds/${world.id}`)
}
