import fs from 'fs';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function runTest() {
  console.log("=== STARTING IMPORT TEST ===");
  
  const htmlContent = fs.readFileSync('./public/messages.html', 'utf8');
  const $ = cheerio.load(htmlContent);
  const messages = [];
  const participantsSet = new Set();
  
  let sequenceNumber = 1;

  // Let's test Date parsing specifically
  console.log("Testing Date parser with '08.03.2026 15:04:31 UTC+05:30'");
  const testDate = new Date("08.03.2026 15:04:31 UTC+05:30");
  console.log("Parsed result:", testDate.toISOString().catch ? "Invalid Date" : testDate);

  $('.message.default').each((i, el) => {
    const isSystem = $(el).hasClass('service');
    const senderName = $(el).find('.from_name').text().trim();
    // Use .html() and convert <br> to \n for multiline?
    // The current importer just uses .text() which loses newlines and formatting!
    const textNode = $(el).find('.text');
    let text = textNode.text().trim(); 
    
    const dateText = $(el).find('.date.details').attr('title');

    if (!senderName || !text || !dateText) return;

    // Fix Telegram Date Format (DD.MM.YYYY HH:MM:SS UTC+XX:XX)
    // "08.03.2026 15:04:31 UTC+05:30"
    let parsedDate = new Date(dateText);
    const parts = dateText.split(' ');
    if (parts.length >= 2) {
      const dateParts = parts[0].split('.');
      if (dateParts.length === 3) {
        // Reformat to YYYY-MM-DD
        const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}${parts[2] ? parts[2].replace('UTC', '') : ''}`;
        parsedDate = new Date(isoDate);
      }
    }

    if (isNaN(parsedDate.getTime())) return;

    if (!isSystem) {
      participantsSet.add(senderName);
    }

    messages.push({
      telegramMessageId: $(el).attr('id') || null,
      senderName,
      text,
      timestamp: parsedDate,
      isSystem,
      sequenceNumber: sequenceNumber++
    });
  });

  console.log(`\n# Import Test Results`);
  console.log(`* Total participants detected: ${participantsSet.size}`);
  console.log(`* Total messages detected: ${messages.length}`);
  
  if (messages.length > 0) {
    console.log(`* First message timestamp: ${messages[0].timestamp}`);
    console.log(`* Last message timestamp: ${messages[messages.length - 1].timestamp}`);
  }

  console.log("\nSample message:");
  console.log(messages[0]);
  
  console.log("\nParticipant List:");
  console.log(Array.from(participantsSet));

  console.log("\n=== VALIDATING CREATION ===");
  // Create mock user and world to test full process
  try {
    const user = await db.user.findFirst();
    if (!user) throw new Error("No user in DB.");

    let world = await db.world.findFirst({ where: { name: 'Import Test World' } });
    if (!world) {
      world = await db.world.create({
        data: { name: 'Import Test World', slug: 'import-test-world', ownerUserId: user.id }
      });
    }

    // Create Characters
    const charIds = {};
    for (const pName of Array.from(participantsSet)) {
      const char = await db.character.create({
        data: { name: String(pName), slug: String(pName).toLowerCase().replace(/[^a-z0-9]/g, '-'), ownerUserId: user.id }
      });
      charIds[String(pName)] = char.id;
    }

    // Create Import
    const importRecord = await db.telegramImport.create({
      data: {
        userId: user.id,
        worldId: world.id,
        fileName: 'messages.html',
        status: "PARSED",
        participants: {
          create: Array.from(participantsSet).map(name => ({ telegramName: String(name) }))
        },
        messages: {
          create: messages
        }
      },
      include: { participants: true }
    });

    console.log(`Created Import: ${importRecord.id}`);

    // Map Participants
    const mappings = {};
    for (const p of importRecord.participants) {
      mappings[p.id] = charIds[p.telegramName];
    }

    // Process Import
    const scene = await db.scene.create({
      data: {
        worldId: world.id,
        createdByUserId: user.id,
        title: "Test Imported Scene",
        summary: "Imported from Telegram",
        visibility: "WORLD",
        status: "COMPLETED",
        startedAt: messages.length > 0 ? messages[0].timestamp : new Date(),
        endedAt: messages.length > 0 ? messages[messages.length - 1].timestamp : new Date(),
        lastActivityAt: new Date(),
        participants: {
          create: Object.values(mappings).map(charId => ({
            userId: user.id,
            characterId: String(charId),
            participantStatus: "ACTIVE"
          }))
        }
      }
    });

    const postsData = messages.filter(m => !m.isSystem).map((msg, index) => {
      const participant = importRecord.participants.find(p => p.telegramName === msg.senderName);
      const mappedCharacterId = participant ? mappings[participant.id] : null;

      return {
        sceneId: scene.id,
        userId: user.id,
        characterId: mappedCharacterId || null,
        body: msg.text,
        postType: "IN_CHARACTER",
        sequenceNumber: index + 1,
        createdAt: msg.timestamp,
        updatedAt: msg.timestamp
      };
    });

    // Handle string length verification
    const longMessages = postsData.filter(m => m.body.length > 500);
    console.log(`Found ${longMessages.length} messages longer than 500 characters.`);

    await db.scenePost.createMany({ data: postsData });

    console.log(`Successfully created Scene ${scene.id} with ${postsData.length} posts.`);

    const count = await db.scenePost.count({ where: { sceneId: scene.id } });
    console.log(`* Number of Scene Posts created: ${count}`);
    
    console.log("\n=== FINISHED ===");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await db.$disconnect();
  }
}

runTest();
