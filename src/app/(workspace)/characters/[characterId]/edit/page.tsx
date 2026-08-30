import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { editCharacter } from "@/server/actions/characters"
import { requireUserId } from "@/server/auth-guards"

export default async function EditCharacterPage(
  props: PageProps<"/characters/[characterId]/edit">
) {
  const userId = await requireUserId()
  const { characterId } = await props.params

  const char = await prisma.character.findUnique({
    where: { id: characterId }
  })

  if (!char || char.userId !== userId) {
    redirect("/characters")
  }

  // We need to bind the characterId to the server action
  const updateAction = editCharacter.bind(null, characterId)

  return (
    <div className="mx-auto max-w-2xl p-6 mt-12">
      <div className="rounded-3xl border border-line bg-surface p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Character</h1>
        <p className="mt-2 text-muted">Update {char.name}&rsquo;s details.</p>

        <form action={updateAction} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted">Character Name</label>
              <input
                name="name"
                type="text"
                required
                defaultValue={char.name}
                className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-white placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted">Avatar URL (Optional)</label>
              <input
                name="avatarUrl"
                type="url"
                defaultValue={char.avatarUrl || ""}
                placeholder="https://..."
                className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-white placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted">Bio (Optional)</label>
              <textarea
                name="bio"
                rows={4}
                defaultValue={char.bio || ""}
                className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-white placeholder-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-full bg-accent px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-accent-soft"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
