"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomBytes } from "crypto"

export async function createWorld(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const characterId = formData.get("characterId") as string

  if (!name || !characterId) throw new Error("Name and Character are required")

  // Generate a random 6-character alphanumeric invite code
  const inviteCode = randomBytes(3).toString("hex").toUpperCase()

  const world = await prisma.world.create({
    data: {
      name,
      description,
      inviteCode,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          characterId,
          role: "OWNER"
        }
      }
    }
  })

  revalidatePath("/dashboard")
  redirect(`/worlds/${world.id}`)
}

export async function joinWorld(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const inviteCode = formData.get("inviteCode") as string
  const characterId = formData.get("characterId") as string

  if (!inviteCode || !characterId) throw new Error("Invite Code and Character are required")

  const world = await prisma.world.findUnique({
    where: { inviteCode }
  })

  if (!world) throw new Error("Invalid invite code")

  // Check if user is already a member
  const existingMember = await prisma.worldMember.findUnique({
    where: {
      worldId_userId: {
        worldId: world.id,
        userId: session.user.id
      }
    }
  })

  if (existingMember) {
    redirect(`/worlds/${world.id}`)
  }

  await prisma.worldMember.create({
    data: {
      worldId: world.id,
      userId: session.user.id,
      characterId,
      role: "MEMBER"
    }
  })

  revalidatePath("/dashboard")
  redirect(`/worlds/${world.id}`)
}
