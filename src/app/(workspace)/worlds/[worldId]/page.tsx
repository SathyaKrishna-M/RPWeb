import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ChatClient from "./ChatClient"

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
      world: true
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

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div>
          <h2 className="text-lg font-bold text-white">{member.world.name}</h2>
          <p className="text-xs text-slate-400">Invite Code: <span className="font-mono text-indigo-300">{member.world.inviteCode}</span></p>
        </div>
      </div>
      
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
