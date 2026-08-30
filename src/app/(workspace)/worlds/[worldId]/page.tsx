import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/server/auth-guards"
import { serializeMessage, MESSAGE_PAGE_SIZE } from "@/lib/messages"
import ChatClient from "./ChatClient"

export default async function WorldPage(props: PageProps<"/worlds/[worldId]">) {
  const userId = await requireUserId()
  const { worldId } = await props.params

  const member = await prisma.worldMember.findUnique({
    where: { worldId_userId: { worldId, userId } },
    include: {
      character: true,
      world: {
        include: {
          _count: { select: { messages: true, members: true } },
          imports: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  })

  if (!member) {
    redirect("/dashboard")
  }

  // Load the NEWEST page, not the oldest. Reading ascending with a fixed `take`
  // meant that once a world passed the limit the chat froze on its opening
  // scenes and nothing newly written was ever visible.
  const recent = await prisma.message.findMany({
    where: { worldId },
    orderBy: { timestamp: "desc" },
    include: { character: true },
    take: MESSAGE_PAGE_SIZE + 1,
  })

  const hasOlder = recent.length > MESSAGE_PAGE_SIZE
  const page = hasOlder ? recent.slice(0, MESSAGE_PAGE_SIZE) : recent
  const serializedMessages = page.reverse().map(serializeMessage)

  const allMyCharacters = await prisma.character.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, avatarUrl: true },
  })

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen flex-col">
      <ChatClient
        initialMessages={serializedMessages}
        initialHasOlder={hasOlder}
        initialMessageCount={member.world._count.messages}
        world={{
          id: member.world.id,
          name: member.world.name,
          inviteCode: member.world.inviteCode,
          memberCount: member.world._count.members,
        }}
        importDate={member.world.imports[0]?.createdAt.toISOString() ?? null}
        worldId={worldId}
        myCharacter={{
          id: member.character.id,
          name: member.character.name,
          avatarUrl: member.character.avatarUrl,
        }}
        allMyCharacters={allMyCharacters}
      />
    </div>
  )
}
