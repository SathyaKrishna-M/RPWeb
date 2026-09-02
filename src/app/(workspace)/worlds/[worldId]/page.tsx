import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireUserId } from "@/server/auth-guards"
import { serializeMessage, MESSAGE_PAGE_SIZE } from "@/lib/messages"
import { avatarSrc, bannerSrc } from "@/lib/characters"
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
          cast: { include: { character: true }, orderBy: { addedAt: "asc" } },
          imports: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  })

  if (!member) {
    redirect("/dashboard")
  }

  const world = member.world

  // These three do not depend on each other, so they go together: each query
  // is a separate trip to the database, and run one after another they add up
  // to most of the time before the page can render.
  const [recent, totalMessageCount, newestChange] = await Promise.all([
    // The NEWEST page, not the oldest: reading ascending with a fixed take
    // meant that once a world passed the limit the chat froze on its opening
    // scenes and nothing newly written was ever visible.
    prisma.message.findMany({
      where: { worldId, deletedAt: null },
      orderBy: { timestamp: "desc" },
      include: { character: true },
      take: MESSAGE_PAGE_SIZE + 1,
    }),
    prisma.message.count({ where: { worldId, deletedAt: null } }),
    // The polling cursor starts at the newest change already on screen, so the
    // first poll asks only for what happened after this render.
    prisma.message.findFirst({
      where: { worldId },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ])

  const hasOlder = recent.length > MESSAGE_PAGE_SIZE
  const page = hasOlder ? recent.slice(0, MESSAGE_PAGE_SIZE) : recent
  const messages = page.reverse().map(serializeMessage)

  // Anyone in the world may write as anyone in its cast, so the choices in the
  // composer come from the world rather than from what this person created.
  const cast = world.cast.map((entry) => entry.character)

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
        castCount: cast.length,
      }}
      panelWorld={{
        id: world.id,
        name: world.name,
        description: world.description,
        bannerUrl: world.bannerUrl,
        bannerSrc: bannerSrc(world),
        inviteCode: world.inviteCode,
        createdAt: world.createdAt.toISOString(),
        importedAt: world.imports[0]?.createdAt.toISOString() ?? null,
      }}
      participants={cast.map((character) => {
        const player = world.members.find((m) => m.characterId === character.id)
        return {
          characterId: character.id,
          name: character.name,
          avatarUrl: avatarSrc(character),
          color: character.color,
          title: character.title,
          role: player?.role ?? null,
          isYou: player?.userId === userId,
        }
      })}
      initialMessages={messages}
      initialHasOlder={hasOlder}
      initialCursor={(newestChange?.updatedAt ?? new Date(0)).toISOString()}
      totalMessageCount={totalMessageCount}
      castCharacterIds={cast.map((c) => c.id)}
      ownerCharacterIds={ownerCharacterIds}
      postAsCharacters={cast.map((c) => ({
        id: c.id,
        name: c.name,
        avatarUrl: avatarSrc(c),
        color: c.color,
      }))}
      defaultCharacterId={member.characterId}
      importDate={world.imports[0]?.createdAt.toISOString() ?? null}
    />
  )
}
