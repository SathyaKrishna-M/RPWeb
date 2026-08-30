import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/server/auth-guards"
import { serializeMessage, MESSAGE_PAGE_SIZE } from "@/lib/messages"
import WorldView from "./WorldView"

export default async function WorldPage(props: PageProps<"/worlds/[worldId]">) {
  const userId = await requireUserId()
  const { worldId } = await props.params

  const member = await prisma.worldMember.findUnique({
    where: { worldId_userId: { worldId, userId } },
    include: {
      character: true,
      world: {
        include: {
          members: { include: { character: true } },
          imports: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  })

  if (!member) {
    redirect("/dashboard")
  }

  const world = member.world

  // Load the NEWEST page, not the oldest: reading ascending with a fixed take
  // meant that once a world passed the limit the chat froze on its opening
  // scenes and nothing newly written was ever visible.
  const recent = await prisma.message.findMany({
    where: { worldId, deletedAt: null },
    orderBy: { timestamp: "desc" },
    include: { character: true },
    take: MESSAGE_PAGE_SIZE + 1,
  })

  const hasOlder = recent.length > MESSAGE_PAGE_SIZE
  const page = hasOlder ? recent.slice(0, MESSAGE_PAGE_SIZE) : recent
  const messages = page.reverse().map(serializeMessage)

  const totalMessageCount = await prisma.message.count({
    where: { worldId, deletedAt: null },
  })

  // The polling cursor starts at the newest change we are already showing, so
  // the first poll asks only for what happened after this render.
  const newestChange = await prisma.message.findFirst({
    where: { worldId },
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  })

  const myCharacters = await prisma.character.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, avatarUrl: true },
  })

  const ownerCharacterIds = world.members
    .filter((m) => m.role === "OWNER")
    .map((m) => m.characterId)

  return (
    <WorldView
      world={{
        id: world.id,
        name: world.name,
        inviteCode: world.inviteCode,
        memberCount: world.members.length,
      }}
      panelWorld={{
        id: world.id,
        name: world.name,
        description: world.description,
        bannerUrl: world.bannerUrl,
        inviteCode: world.inviteCode,
        createdAt: world.createdAt.toISOString(),
        importedAt: world.imports[0]?.createdAt.toISOString() ?? null,
        ownedByYou: world.ownerId === userId,
      }}
      participants={world.members.map((m) => ({
        characterId: m.characterId,
        name: m.character.name,
        avatarUrl: m.character.avatarUrl,
        role: m.role,
        isYou: m.userId === userId,
      }))}
      initialMessages={messages}
      initialHasOlder={hasOlder}
      initialCursor={(newestChange?.updatedAt ?? new Date(0)).toISOString()}
      totalMessageCount={totalMessageCount}
      myCharacterIds={myCharacters.map((c) => c.id)}
      ownerCharacterIds={ownerCharacterIds}
      postAsCharacters={myCharacters}
      defaultCharacterId={member.characterId}
      importDate={world.imports[0]?.createdAt.toISOString() ?? null}
    />
  )
}
