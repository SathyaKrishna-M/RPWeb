#!/usr/bin/env node
/**
 * Moves existing data onto the shared-cast model.
 *
 * 1. Fills each world's cast with every character that has written there or is
 *    played by a member, so nothing that already exists becomes unusable.
 * 2. Merges characters that duplicate a name inside one world. Before the cast
 *    existed, each person could only write as characters they had created, so
 *    a second person joining a world made their own copy of a character that
 *    was already in it — leaving two rows with the same name, different
 *    colours, and the history split between them.
 *
 * Safe to run more than once. Pass --dry to see what it would do.
 *
 *   node scripts/migrate-cast.mjs --dry
 *   node scripts/migrate-cast.mjs
 */
import { PrismaClient } from "@prisma/client"

const dryRun = process.argv.includes("--dry")
const prisma = new PrismaClient()

const norm = (name) => name.trim().toLowerCase()

try {
  const worlds = await prisma.world.findMany({
    include: {
      members: true,
      cast: true,
      messages: { select: { characterId: true } },
    },
  })

  let castAdded = 0
  let merged = 0
  let messagesMoved = 0

  for (const world of worlds) {
    // --- every character already involved in this world ---
    const involved = new Set([
      ...world.messages.map((m) => m.characterId),
      ...world.members.map((m) => m.characterId),
    ])

    const characters = await prisma.character.findMany({
      where: { id: { in: [...involved] } },
      include: { _count: { select: { messages: true } } },
    })

    // --- merge same-named characters, keeping the most-written-in one ---
    const byName = new Map()
    for (const c of characters) {
      const key = norm(c.name)
      if (!byName.has(key)) byName.set(key, [])
      byName.get(key).push(c)
    }

    const replacedBy = new Map()

    for (const [, group] of byName) {
      if (group.length < 2) continue
      // The one carrying the most history wins, so the story stays continuous.
      group.sort((a, b) => b._count.messages - a._count.messages)
      const [keep, ...dupes] = group

      for (const dupe of dupes) {
        console.log(
          `${world.name}: merging "${dupe.name}" (${dupe._count.messages} messages) ` +
            `into the copy with ${keep._count.messages}`
        )
        replacedBy.set(dupe.id, keep.id)
        merged++
        messagesMoved += dupe._count.messages

        if (dryRun) continue

        await prisma.$transaction([
          prisma.message.updateMany({
            where: { characterId: dupe.id },
            data: { characterId: keep.id },
          }),
          prisma.worldMember.updateMany({
            where: { characterId: dupe.id },
            data: { characterId: keep.id },
          }),
          prisma.worldCharacter.deleteMany({ where: { characterId: dupe.id } }),
          prisma.character.delete({ where: { id: dupe.id } }),
        ])
      }
    }

    // --- fill the cast, using the surviving id for anything merged away ---
    const finalIds = new Set(
      [...involved].map((id) => replacedBy.get(id) ?? id).filter((id) => {
        // A merged-away character no longer exists.
        return !replacedBy.has(id)
      })
    )

    const already = new Set(world.cast.map((c) => c.characterId))
    for (const characterId of finalIds) {
      if (already.has(characterId)) continue
      castAdded++
      if (dryRun) continue
      await prisma.worldCharacter.create({
        data: { worldId: world.id, characterId },
      })
    }

    console.log(`${world.name}: cast now ${finalIds.size} characters`)
  }

  console.log(
    `\n${dryRun ? "[dry run] would add" : "added"} ${castAdded} cast entries; ` +
      `${dryRun ? "would merge" : "merged"} ${merged} duplicate character(s), ` +
      `moving ${messagesMoved} message(s)`
  )
} catch (error) {
  console.error("Migration failed:", error.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
