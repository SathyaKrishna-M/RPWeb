import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { editCharacter } from "@/server/actions/characters"
import { requireUserId } from "@/server/auth-guards"
import CharacterForm from "@/components/characters/CharacterForm"

export default async function EditCharacterPage(
  props: PageProps<"/characters/[characterId]/edit">
) {
  const userId = await requireUserId()
  const { characterId } = await props.params

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { worlds: { include: { world: { select: { name: true } } } } },
  })

  if (!character) redirect("/characters")

  // Editable by whoever made it, or by anyone sharing a world with it: a
  // character in a shared cast belongs to the story, not to one person.
  const shared = await prisma.worldCharacter.findFirst({
    where: { characterId, world: { members: { some: { userId } } } },
    select: { id: true },
  })
  if (character.userId !== userId && !shared) redirect("/characters")

  const updateAction = editCharacter.bind(null, characterId)
  const worldNames = character.worlds.map((w) => w.world.name)

  return (
    <div className="mx-auto max-w-2xl p-6 lg:mt-8">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Edit Character</h1>
        <p className="mt-2 text-muted">
          {worldNames.length > 0 ? (
            <>
              Shared in {worldNames.join(", ")} — changes show for everyone there.
            </>
          ) : (
            <>Not in a world yet.</>
          )}
        </p>

        <div className="mt-8">
          <CharacterForm
            action={updateAction}
            submitLabel="Save Changes"
            defaults={{
              id: character.id,
              name: character.name,
              title: character.title ?? "",
              avatarUrl: character.avatarUrl ?? "",
              color: character.color ?? "",
              bio: character.bio ?? "",
            }}
          />
        </div>
      </div>
    </div>
  )
}
