"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId, requireOwnedCharacter } from "@/server/auth-guards"
import { generateInviteCode } from "@/lib/invite-code"
import { parseDataUrl, MAX_BANNER_BYTES } from "@/lib/characters"

export async function createWorld(formData: FormData) {
  const userId = await requireUserId()

  const name = (formData.get("name") as string | null)?.trim()
  const description = (formData.get("description") as string | null)?.trim() || null
  const characterId = formData.get("characterId") as string

  if (!name) throw new Error("Name is required")
  // The character id comes straight from the form, so ownership is verified
  // before it is attached to a membership.
  const ownedCharacterId = await requireOwnedCharacter(userId, characterId)

  const world = await prisma.world.create({
    data: {
      name,
      description,
      inviteCode: await generateInviteCode(),
      ownerId: userId,
      members: {
        create: {
          userId,
          characterId: ownedCharacterId,
          role: "OWNER",
        },
      },
      cast: { create: { characterId: ownedCharacterId } },
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/worlds")
  redirect(`/worlds/${world.id}`)
}

export async function joinWorld(formData: FormData) {
  const userId = await requireUserId()

  const inviteCode = (formData.get("inviteCode") as string | null)?.trim().toUpperCase()
  const submittedCharacterId = formData.get("characterId") as string

  if (!inviteCode) throw new Error("Invite code is required")
  const ownedCharacterId = await requireOwnedCharacter(userId, submittedCharacterId)

  const world = await prisma.world.findUnique({
    where: { inviteCode },
    select: { id: true },
  })

  if (!world) throw new Error("Invalid invite code")

  // If the world already has a character by this name, join as that one rather
  // than adding a second copy. Two rows with the same name would show as two
  // different people, with separate colours and a split history.
  const chosen = await prisma.character.findUnique({
    where: { id: ownedCharacterId },
    select: { name: true },
  })
  const existing = chosen
    ? await prisma.worldCharacter.findFirst({
        where: {
          worldId: world.id,
          character: { name: { equals: chosen.name, mode: "insensitive" } },
        },
        select: { characterId: true },
      })
    : null
  const characterId = existing?.characterId ?? ownedCharacterId

  const existingMember = await prisma.worldMember.findUnique({
    where: { worldId_userId: { worldId: world.id, userId } },
    select: { id: true },
  })

  if (!existingMember) {
    await prisma.worldMember.create({
      data: { worldId: world.id, userId, characterId, role: "MEMBER" },
    })
    await prisma.worldCharacter.upsert({
      where: { worldId_characterId: { worldId: world.id, characterId } },
      create: { worldId: world.id, characterId },
      update: {},
    })
    revalidatePath("/dashboard")
    revalidatePath("/worlds")
  }

  redirect(`/worlds/${world.id}`)
}

/** Owner-only edit of the world's presentation: name, description, banner. */
export async function updateWorld(worldId: string, formData: FormData) {
  const userId = await requireUserId()

  const world = await prisma.world.findUnique({
    where: { id: worldId },
    select: { ownerId: true },
  })
  if (!world) throw new Error("World not found")
  if (world.ownerId !== userId) throw new Error("Only the world owner can edit it")

  const name = (formData.get("name") as string | null)?.trim()
  const description = (formData.get("description") as string | null)?.trim() || null
  const bannerUrl = (formData.get("bannerUrl") as string | null)?.trim() || null

  if (!name) throw new Error("Name is required")
  if (bannerUrl && !/^https?:\/\//i.test(bannerUrl)) {
    throw new Error("Banner must be a http(s) image URL")
  }

  await prisma.world.update({
    where: { id: worldId },
    data: { name, description, bannerUrl },
  })
  await applyBannerImage(worldId, formData.get("bannerImage"))

  revalidatePath(`/worlds/${worldId}`)
  revalidatePath("/worlds")
  revalidatePath("/dashboard")
}

/**
 * Applies whatever the banner field asked for.
 *
 * Absent means the form did not touch it, so an uploaded banner survives an
 * edit to the name. Empty means remove it. Anything else is a cropped image.
 */
async function applyBannerImage(worldId: string, raw: FormDataEntryValue | null) {
  if (raw === null) return
  const value = String(raw)

  if (!value) {
    await prisma.worldBanner.deleteMany({ where: { worldId } })
    await prisma.world.update({ where: { id: worldId }, data: { bannerUpdatedAt: null } })
    return
  }

  const { mime, bytes } = parseDataUrl(value, MAX_BANNER_BYTES)
  await prisma.worldBanner.upsert({
    where: { worldId },
    create: { worldId, data: bytes, mime },
    update: { data: bytes, mime },
  })
  // Bumped so the image URL changes and caches stop serving the old banner.
  await prisma.world.update({
    where: { id: worldId },
    data: { bannerUpdatedAt: new Date() },
  })
}
