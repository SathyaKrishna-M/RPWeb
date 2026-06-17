"use server";

import { db } from "@/server/db";
import { auth } from "@/auth";
import * as cheerio from "cheerio";
import crypto from "crypto";

export async function createTelegramImport(worldId: string, htmlContent: string, fileName: string, force: boolean = false) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    const fileHash = crypto.createHash('sha256').update(htmlContent).digest('hex');

    if (!force) {
      const existing = await db.telegramImport.findUnique({
        where: { fileHash }
      });
      if (existing) {
        return { warning: "duplicate", existingId: existing.id };
      }
    }

    const $ = cheerio.load(htmlContent);
    const messages: any[] = [];
    const participantsSet = new Set<string>();

    let sequenceNumber = 1;

    $('.message.default').each((i, el) => {
      const isSystem = $(el).hasClass('service');
      const senderName = $(el).find('.from_name').text().trim();
      // Preserve newlines by replacing <br> with \n
      const textNode = $(el).find('.text').clone();
      textNode.find('br').replaceWith('\n');
      const text = textNode.text().trim();
      
      const dateText = $(el).find('.date.details').attr('title');

      if (!senderName || !text || !dateText) return;

      // Fix Telegram Date Format (DD.MM.YYYY HH:MM:SS UTC+XX:XX)
      // "08.03.2026 15:04:31 UTC+05:30"
      let timestamp = new Date(dateText);
      const parts = dateText.split(' ');
      if (parts.length >= 2) {
        const dateParts = parts[0].split('.');
        if (dateParts.length === 3) {
          // Reformat to YYYY-MM-DD
          const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}${parts[2] ? parts[2].replace('UTC', '') : ''}`;
          timestamp = new Date(isoDate);
        }
      }

      if (isNaN(timestamp.getTime())) return;

      if (!isSystem) {
        participantsSet.add(senderName);
      }

      messages.push({
        telegramMessageId: $(el).attr('id') || null,
        senderName,
        text,
        timestamp,
        isSystem,
        sequenceNumber: sequenceNumber++
      });
    });

    if (messages.length === 0) {
      return { error: "No messages found in the provided HTML file." };
    }

    const firstMessageAt = messages[0].timestamp;
    const lastMessageAt = messages[messages.length - 1].timestamp;

    const importRecord = await db.telegramImport.create({
      data: {
        userId: session.user.id,
        worldId,
        fileName,
        fileHash,
        status: "PARSED",
        messageCount: messages.length,
        participantCount: participantsSet.size,
        firstMessageAt,
        lastMessageAt,
        participants: {
          create: Array.from(participantsSet).map(name => ({
            telegramName: name
          }))
        },
        messages: {
          create: messages
        }
      }
    });

    return { success: true, importId: importRecord.id };
  } catch (error) {
    console.error("Error creating telegram import:", error);
    return { error: "Failed to parse and create import." };
  }
}

export async function getTelegramImport(importId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    const importRecord = await db.telegramImport.findUnique({
      where: { id: importId },
      include: {
        participants: true,
        world: {
          include: {
            characters: {
              where: { status: "ACTIVE" },
              select: { id: true, name: true, avatarUrl: true }
            }
          }
        }
      }
    });

    if (!importRecord) return { error: "Import not found." };
    if (importRecord.userId !== session.user.id) return { error: "Unauthorized." };

    return { success: true, importRecord };
  } catch (error) {
    console.error("Error fetching import:", error);
    return { error: "Failed to fetch import details." };
  }
}

export async function processTelegramImport(importId: string, mappings: Record<string, string>, title: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    const importRecord = await db.telegramImport.findUnique({
      where: { id: importId },
      include: {
        participants: true,
        messages: {
          orderBy: { sequenceNumber: 'asc' }
        }
      }
    });

    if (!importRecord) return { error: "Import not found." };
    if (importRecord.userId !== session.user.id) return { error: "Unauthorized." };
    if (!importRecord.worldId) return { error: "World ID is missing for this import." };

    const userId = session.user.id;
    // Create scene
    const scene = await db.scene.create({
      data: {
        worldId: importRecord.worldId,
        createdByUserId: userId,
        title: title || "Imported Scene",
        summary: "Imported from Telegram",
        visibility: "WORLD",
        status: "COMPLETED",
        startedAt: importRecord.messages.length > 0 ? importRecord.messages[0].timestamp : new Date(),
        endedAt: importRecord.messages.length > 0 ? importRecord.messages[importRecord.messages.length - 1].timestamp : new Date(),
        lastActivityAt: new Date(),
        participants: {
          create: Object.values(mappings).map(charId => ({
            userId: userId,
            characterId: charId,
            participantStatus: "ACTIVE"
          }))
        }
      }
    });

    // Create scene posts
    const postsData = importRecord.messages.filter(m => !m.isSystem).map((msg, index) => {
      const participant = importRecord.participants.find(p => p.telegramName === msg.senderName);
      const mappedCharacterId = participant ? mappings[participant.id] : null;

      return {
        sceneId: scene.id,
        userId: userId,
        characterId: mappedCharacterId || null,
        body: msg.text,
        postType: "IN_CHARACTER" as any,
        sequenceNumber: index + 1,
        createdAt: msg.timestamp,
        updatedAt: msg.timestamp
      };
    });

    await db.scenePost.createMany({
      data: postsData
    });

    await db.telegramImport.update({
      where: { id: importId },
      data: {
        status: "IMPORTED",
        createdSceneId: scene.id
      }
    });

    return { success: true, sceneId: scene.id };
  } catch (error) {
    console.error("Error processing import:", error);
    return { error: "Failed to process import." };
  }
}

export async function rollbackTelegramImport(importId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    const importRecord = await db.telegramImport.findUnique({
      where: { id: importId }
    });

    if (!importRecord) return { error: "Import not found." };
    if (importRecord.userId !== session.user.id) return { error: "Unauthorized." };

    if (importRecord.createdSceneId) {
      await db.scene.delete({
        where: { id: importRecord.createdSceneId }
      });
    }

    await db.telegramImport.update({
      where: { id: importId },
      data: { 
        status: "ROLLED_BACK",
        createdSceneId: null 
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error rolling back import:", error);
    return { error: "Failed to rollback import." };
  }
}
