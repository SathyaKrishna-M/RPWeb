"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUserId, requireOwnedCharacter } from "@/server/auth-guards"

function readCharacterForm(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim()
  const avatarUrl = (formData.get("avatarUrl") as string | null)?.trim() || null
  const bio = (formData.get("bio") as string | null)?.trim() || null

  if (!name) throw new Error("Name is required")
  return { name, avatarUrl, bio }
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

  await requireOwnedCharacter(userId, characterId)

  await prisma.character.update({
    where: { id: characterId },
    data,
  })

  revalidatePath("/characters")
  revalidatePath("/dashboard")
  redirect("/characters")
}
