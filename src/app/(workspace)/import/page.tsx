import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ImportClient from "./ImportClient"

export default async function ImportPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const characters = await prisma.character.findMany({
    where: { userId: session.user.id }
  })

  if (characters.length === 0) {
    redirect("/characters/new")
  }

  return <ImportClient characters={characters} />
}
