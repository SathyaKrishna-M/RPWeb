"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCharacter(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const avatarUrl = formData.get("avatarUrl") as string | null
  const bio = formData.get("bio") as string | null

  if (!name) throw new Error("Name is required")

  await prisma.character.create({
    data: {
      userId: session.user.id,
      name,
      avatarUrl,
      bio,
    }
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}
