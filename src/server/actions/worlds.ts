"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId, requireOwnedCharacter } from "@/server/auth-guards"
import { generateInviteCode } from "@/lib/invite-code"

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
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/worlds")
  redirect(`/worlds/${world.id}`)
}

export async function joinWorld(formData: FormData) {
  const userId = await requireUserId()

  const inviteCode = (formData.get("inviteCode") as string | null)?.trim().toUpperCase()
  const characterId = formData.get("characterId") as string

  if (!inviteCode) throw new Error("Invite code is required")
  const ownedCharacterId = await requireOwnedCharacter(userId, characterId)

  const world = await prisma.world.findUnique({
    where: { inviteCode },
    select: { id: true },
  })

  if (!world) throw new Error("Invalid invite code")

  const existingMember = await prisma.worldMember.findUnique({
    where: { worldId_userId: { worldId: world.id, userId } },
    select: { id: true },
  })

  if (!existingMember) {
    await prisma.worldMember.create({
      data: {
        worldId: world.id,
        userId,
        characterId: ownedCharacterId,
        role: "MEMBER",
      },
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

  revalidatePath(`/worlds/${worldId}`)
  revalidatePath("/worlds")
  revalidatePath("/dashboard")
}
