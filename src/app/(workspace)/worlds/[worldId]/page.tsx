import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ChatClient from "./ChatClient"
import WorldHeader from "./WorldHeader"

export default async function WorldPage({
  params
}: {
  params: { worldId: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { worldId } = await params

  const member = await prisma.worldMember.findUnique({
    where: {
      worldId_userId: {
        worldId,
        userId: session.user.id
      }
    },
    include: {
      character: true,
      world: {
        include: {
          _count: {
            select: { messages: true, members: true }
          },
          imports: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  })

  if (!member) {
    redirect("/dashboard")
  }

  const messages = await prisma.message.findMany({
    where: { worldId },
    orderBy: { timestamp: "asc" },
    include: { character: true },
    take: 500 // Limit for MVP
  })

  // Format messages to pass to client
  const serializedMessages = messages.map(m => ({
    id: m.id,
    worldId: m.worldId,
    content: m.content,
    format: m.format,
    timestamp: m.timestamp.toISOString(),
    isImported: m.isImported,
    character: {
      id: m.character.id,
      name: m.character.name,
      avatarUrl: m.character.avatarUrl
    }
  }))

  const importDate = member.world.imports[0]?.createdAt || null

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen flex-col">
      <WorldHeader world={member.world} importDate={importDate} />
      
      <div className="flex-1 overflow-hidden">
        <ChatClient 
          initialMessages={serializedMessages} 
          worldId={worldId} 
          myCharacter={member.character} 
        />
      </div>
    </div>
  )
}
