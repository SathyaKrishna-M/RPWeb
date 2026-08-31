"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId, requireEditableCharacter } from "@/server/auth-guards"
import { normalizeColor } from "@/lib/characters"

function readCharacterForm(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim()
  const avatarUrl = (formData.get("avatarUrl") as string | null)?.trim() || null
  const bio = (formData.get("bio") as string | null)?.trim() || null
  const title = (formData.get("title") as string | null)?.trim() || null
  const color = normalizeColor(formData.get("color") as string | null)

  if (!name) throw new Error("Name is required")
  if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
    throw new Error("Avatar must be a http(s) image URL")
  }
  return { name, avatarUrl, bio, title, color }
}

export async function createCharacter(formData: FormData) {
  const userId = await requireUserId()
  const data = readCharacterForm(formData)

  await prisma.character.create({
    data: { userId, ...data },
  })

  revalidatePath("/dashboard")
  revalidatePath("/characters")
  redirect("/characters")
}

export async function editCharacter(characterId: string, formData: FormData) {
  const userId = await requireUserId()
  const data = readCharacterForm(formData)

  await requireEditableCharacter(userId, characterId)

  await prisma.character.update({
    where: { id: characterId },
    data,
  })

  revalidatePath("/characters")
  revalidatePath("/dashboard")
  // A character's look is shared, so every world showing it is now stale.
  revalidatePath("/worlds", "layout")
  redirect("/characters")
}
